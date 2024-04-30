import { CandidateInfo } from "../entities/candidateInfo.entity";
import logger from "../configs/logger.config";
import { S3Service } from "./s3.service";
import { ServiceResponse } from "../models/serviceResponse.type";
import { EmailerService } from "./emailer.service";
import { CvUploadStatus } from "../constants/cvUploadStatus.enum";
import { UtilsService } from "./utils.service";
import { CandidateInfoType } from "../models/candidateInfo.type";

export class CandidateService {
  private s3Service = new S3Service();
  private utilsService = new UtilsService();
  private emailerService = new EmailerService();

  public async getOneCandidateInfo(user_id: string): Promise<ServiceResponse> {
    try {
      const candidate = await CandidateInfo.findOne({
        user_id: user_id,
      });

      const key = candidate?.s3_default_bucket_file_key;

      if (candidate && key) {
        const downloadFileResponse = await this.s3Service.getS3DownloadUrl(key);

        logger.info("Candidate and cv both found");

        return {
          status: 200,
          data: candidate,
          message: "Candidate and CV found",
          url: downloadFileResponse.url,
        };
      } else if (candidate && !key) {
        logger.info("Candidate found but cv not found");
        return {
          status: 200,
          data: candidate,
          message: "candidate found but CV not found",
        };
      } else {
        logger.info("Candidate not found");
        return {
          status: 404,
          message: "Candidate not found",
        };
      }
    } catch (error) {
      logger.error("Unknown error in getOneCandidateInfo Service", error);
      return {
        status: 500,
        message: "Unknown error in getOneCandidateInfo Service",
      };
    }
  }

  public async saveUserDetailsToDatabase(
    body: CandidateInfoType,
    accessToken: string,
  ): Promise<ServiceResponse> {
    try {
      const current_user_id = this.utilsService.findCurrentuserId(accessToken);
      const existingCandidate = await CandidateInfo.findOne({
        user_id: current_user_id,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
      let updateQuery: any = {
        user_id: current_user_id,
        fullname: body.fullname,
        email: body.email,
        phone_number: body.phone_number,
        updatedBy: current_user_id,
      };

      if (!existingCandidate) {
        updateQuery.createdBy = current_user_id;
      }

      await CandidateInfo.findOneAndUpdate(
        { user_id: current_user_id },
        updateQuery,
        { upsert: true, new: true },
      );
      logger.info("Candidate details saved to database successfully");
      return { status: 200, message: "Candidate details saved successfully" };
    } catch (error) {
      logger.error("Error in saveUserDetailsToDatabase", error);
      throw new Error("error in saveUserDetailsToDatabase");
    }
  }

  public async findSavedS3key(acessToken: string): Promise<ServiceResponse> {
    try {
      const current_user_id = this.utilsService.findCurrentuserId(acessToken);
      const response = await CandidateInfo.findOne({
        user_id: current_user_id,
      });

      const s3_default_bucket_file_key = response?.s3_default_bucket_file_key;

      // eslint-disable-next-line eqeqeq
      if (response && s3_default_bucket_file_key == null) {
        logger.info("Old file key not found");
        return {
          status: 204,
          message: "old file key not found",
          data: null,
        };
      } else if (response && s3_default_bucket_file_key !== null) {
        logger.info("Old file key found");
        return {
          status: 200,
          message: "old file key found",
          data: response?.s3_default_bucket_file_key,
        };
      } else {
        throw new Error("unkown error in querring candidateInfo");
      }
    } catch (error) {
      logger.error("Unknown error in findSavedS3key", error);
      throw new Error("error in findSavedS3key");
    }
  }
  public async updateS3FileKeyInDatabase(
    accessToken: string,
    newKey: string,
    bucket: string,
  ): Promise<ServiceResponse> {
    try {
      const candidateService = new CandidateService();
      const current_user_id = this.utilsService.findCurrentuserId(accessToken);

      if (bucket === "default") {
        const findSavedS3keyResponse =
          await candidateService.findSavedS3key(accessToken);

        if (findSavedS3keyResponse.status === 200) {
          const oldKey = findSavedS3keyResponse.data as string;
          await this.s3Service.deleteFileFromS3(oldKey);
        }
        await CandidateInfo.updateOne(
          { user_id: current_user_id },
          {
            s3_default_bucket_file_key: newKey,
            updatedBy: current_user_id,
          },
        );

        await this.emailerService.sendEmail(
          accessToken,
          CvUploadStatus.CV_UPLOAD_SUCCESSFUL,
        );

        logger.info("s3_default_bucket key updated in database successfully");
        return {
          status: 200,
          message: "s3_default_bucket key updated successfully",
        };
      } else {
        await CandidateInfo.findOneAndUpdate(
          { user_id: current_user_id },
          {
            s3_bad_bucket_file_key: newKey,
            updatedBy: current_user_id,
          },
        );
        await this.emailerService.sendEmail(
          accessToken,
          CvUploadStatus.CV_UPLOADED_TO_BAD_BUCKET,
        );
        logger.info("s3_bad_bucket key updated in database successfully");
        return {
          status: 200,
          message: "s3_bad_bucket key updated successfully",
        };
      }
    } catch (error) {
      logger.error("Unknown Error in updateS3FileKeyInDatabase", error);
      throw new Error("error in updateS3FileKeyInDatabase");
    }
  }
}
