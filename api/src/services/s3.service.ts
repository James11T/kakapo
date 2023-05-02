import AWS from "aws-sdk";
import { APIServerError } from "../errors";
import logger from "../logging";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_IMAGE_BUCKET } = process.env;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

export const s3 = new AWS.S3({
  apiVersion: "latest",
});

/**
 * Upload a file to AWS S3
 *
 * @param file The file to upload
 * @param key The key (filename) to upload to
 * @param bucket The S3 bucket to upload to
 *
 * @returns A promise of the S3 upload
 */
const uploadFile = async (
  file: Buffer,
  key: string,
  bucket = AWS_S3_IMAGE_BUCKET
): Promise<AWS.S3.ManagedUpload.SendData> => {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: file,
  };

  try {
    const res = await s3.upload(params).promise();
    return res;
  } catch (err) {
    logger.error("Failed to upload image to S3", { error: String(err) });
    throw new APIServerError();
  }
};

export { uploadFile };
