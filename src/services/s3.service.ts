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
      const imageUrl = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: envVars.S3_DEFAULT_BUCKET_NAME,
          Key: key,
        }),
        {
          expiresIn: 60,
        },
      );
      logger.info("Upload Url created");
      return { status: 200, message: "upload url created", data: imageUrl };
    } catch (err) {
      logger.error("Unknown error in creating upload url from s3", err);
      throw new Error("error in generateS3UploadURL");
    }
  }

  public async getS3BadBucketUploadUrl(key: string): Promise<ServiceResponse> {
    try {
      const imageUrl = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: envVars.S3_BAD_BUCKET_NAME,
          Key: key,
        }),
        {
          expiresIn: 60,
        },
      );
      logger.info("Bad bucket upload Url created");
      return {
        status: 200,
        message: "Bad bucket upload url created",
        data: imageUrl,
      };
    } catch (err) {
      logger.error(
        "Unknown error in creating Bad bucket upload url from s3",
        err,
      );
      throw new Error("error in generateS3BadBucketUploadURL");
    }
  }
  public async getS3DownloadUrl(key: string): Promise<ServiceResponse> {
    try {
      const imageUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: envVars.S3_DEFAULT_BUCKET_NAME,
          Key: key,
        }),
        {
          expiresIn: 60,
        },
      );
      logger.info("Url downloaded");
      return { status: 200, message: "url downloaded", data: imageUrl };
    } catch (err) {
      logger.error("Unknown error in downloading file from s3", err);
      throw new Error("error in downloadFileFromS3");
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