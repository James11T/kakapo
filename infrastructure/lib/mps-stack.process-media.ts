import { Context, SQSEvent } from "aws-lambda";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import getAssertiveEnv from "./get-env";
import * as sharp from "sharp";

const env = getAssertiveEnv("STATIC_BUCKET_NAME", "RAW_BUCKET_NAME");

const s3Client = new S3({});

export const handler = async (event: SQSEvent, context: Context) => {
  for (const record of event.Records) {
    const rawImage = await s3Client.getObject({ Bucket: env.RAW_BUCKET_NAME, Key: record.body });
    if (!rawImage.Body) return;
    const uri = await rawImage.Body.transformToString();
    const imageBuffer = Buffer.from(uri);
    const sharpImage = sharp(imageBuffer);
    const metadata = await sharpImage.metadata();
    const resizedImage = sharpImage.resize(
      Math.min(720, metadata.width ?? Number.MAX_SAFE_INTEGER)
    );
    const outputImage = resizedImage.jpeg().toBuffer();

    const s3params = new PutObjectCommand({
      Bucket: env.STATIC_BUCKET_NAME,
      Key: record.body,
      Body: outputImage,
    });

    await s3Client.send(s3params);
  }
};
