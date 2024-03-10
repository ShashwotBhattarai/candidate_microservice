import { Request, Response } from "express";
import { CandidateInfo } from "../models/candidateInfo.model";
import logger from "../configs/logger.config";
import { downloadFileFromS3 } from "../services/s3-fileDownload.service";

export const getOneCandidateController = (req: Request, res: Response) => {
  (async () => {
    try {
      const candidate = await CandidateInfo.findOne({
        user_id: req.params.user_id,
      });

      const key = candidate?.aws_file_key;

      console.log("candidate", candidate);
      if (candidate && key) {
        console.log("iniside if block", key, candidate);
        const downloadFileResponse = await downloadFileFromS3(key);

        logger.info("Candidate found");
        logger.info("File downloaded");

        res
          .status(200)
          .send({ candidate: candidate, url: downloadFileResponse.data });
      } else if (candidate && !key) {
        logger.info("Candidate found");
        logger.error("unable to download file");
        res.status(200).send({ candidate: candidate, url: null });
      } else {
        logger.info(
          "Either Candidate with that user_id not found or key not found",
        );
        res.status(404).json({
          message:
            "Either Candidate with that user_id not found or key not found",
        });
      }
    } catch (error) {
      logger.error("Unknown error in getOneCandidateController", error);
      res.status(500).send({ error: "internal server error" });
    }
  })();
};
