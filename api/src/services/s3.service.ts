import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { POST_CONSTANTS } from "../config.js";
import logger from "../logging.js";
import { uuid } from "../utils/strings.js";

const { AWS_REGION, MEDIA_BUCKET_NAME } = process.env;

export const s3 = new S3Client({
  apiVersion: "latest",
  region: AWS_REGION,
  credentialDefaultProvider: defaultProvider,
});

const getUploadURL = async (contentLength: number) => {
  const key = uuid();

  logger.info("Generating signed upload URL", {
    ID: "GENERATE_SIGNED_UPLOAD_URL_START",
    key,
    contentLength,
  });

  const command = new PutObjectCommand({
    Bucket: MEDIA_BUCKET_NAME,
    Key: key,
    ContentLength: contentLength,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: POST_CONSTANTS.SIGNED_URL_TTL });

  logger.debug("Generated signed upload URL", {
    ID: "GENERATE_SIGNED_UPLOAD_URL_SUCCESS",
    key,
    url,
  });

  return { key, url };
};

export { getUploadURL };
