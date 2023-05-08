import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { APIServerError } from "../errors.js";
import logger from "../logging.js";
import type { PutObjectCommandOutput } from "@aws-sdk/client-s3";

const { AWS_REGION, AWS_S3_IMAGE_BUCKET } = process.env;

export const s3 = new S3Client({
  apiVersion: "latest",
  region: AWS_REGION,
  credentialDefaultProvider: defaultProvider,
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
): Promise<PutObjectCommandOutput> => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
  });

  try {
    const res = await s3.send(command);
    return res;
  } catch (err) {
    logger.error("Failed to upload image to S3", { error: String(err) });
    throw new APIServerError();
  }
};

export { uploadFile };
