import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../configs/s3Client.config";
import logger from "../configs/logger.config";
import { ServiceResponse } from "../models/serviceResponse.type";
import { envVars } from "../configs/envVars.config";

export class S3Service {
  public async getS3DefaultUploadUrl(key: string): Promise<ServiceResponse> {
    try {
      const signedUrl = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: envVars.S3_DEFAULT_BUCKET_NAME,
          Key: key,
        }),
        {
          expiresIn: 60,
        },
      );
      logger.info("s3 Upload Url created");
      return { status: 200, message: "s3 upload url created", url: signedUrl };
    } catch (err) {
      logger.error("Unknown error in creating s3 upload url", err);
      throw new Error("error in getS3DefaultUploadUrl");
    }
  }

  public async getS3BadBucketUploadUrl(key: string): Promise<ServiceResponse> {
    try {
      const signedUrl = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: envVars.S3_BAD_BUCKET_NAME,
          Key: key,
        }),
        {
          expiresIn: 60,
        },
      );
      logger.info("s3 Bad bucket upload Url created");
      return {
        status: 200,
        message: "s3 Bad bucket upload url created",
        data: signedUrl,
      };
    } catch (err) {
      logger.error(
        "Unknown error in creating s3 Bad bucket upload url from s3",
        err,
      );
      throw new Error("error in getS3BadBucketUploadUrl");
    }
  }
  public async getS3DownloadUrl(key: string): Promise<ServiceResponse> {
    try {
      const signedUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: envVars.S3_DEFAULT_BUCKET_NAME,
          Key: key,
        }),
        {
          expiresIn: 60,
        },
      );
      logger.info("s3 signedDownload Url fetched");
      return {
        status: 200,
        message: "s3 signedDownload Url fetched",
        url: signedUrl,
      };
    } catch (err) {
      logger.error("Unknown error in getS3DownloadUrl", err);
      throw new Error("error in getS3DownloadUrl");
    }
  }
  public async deleteFileFromS3(key: string): Promise<ServiceResponse> {
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: envVars.S3_DEFAULT_BUCKET_NAME,
          Key: key,
        }),
      );
      logger.info("File deleted from s3 bucket");
      return { status: 200, message: "file deleted from s3 bucket" };
    } catch (error) {
      logger.error("Unknown Error in deleteFileFromS3", error);
      throw new Error("error in deleteFileFromS3");
    }
  }
}
