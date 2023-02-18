import { Context, SQSEvent } from "aws-lambda";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getAssertiveEnv } from "./get-env";
import sharp from "sharp";
import { SQS } from "@aws-sdk/client-sqs";

const env = getAssertiveEnv("STATIC_BUCKET_NAME", "RAW_BUCKET_NAME", "MODERATE_QUEUE_NAME");

const s3Client = new S3({});
const sqsClient = new SQS({});

export const handler = async (event: SQSEvent, context: Context) => {
  const mediaIds: string[] = [];
  for (const record of event.Records) {
    const rawImage = await s3Client.getObject({ Bucket: env.RAW_BUCKET_NAME, Key: record.body });
    if (!rawImage.Body) return;
    const uri = await rawImage.Body.transformToString();
    const imageBuffer = Buffer.from(uri, "base64");
    const sharpImage = sharp(imageBuffer);
    const metadata = await sharpImage.metadata();
    const resizedImage = sharpImage.resize(
      Math.min(720, metadata.width ?? Number.MAX_SAFE_INTEGER)
    );
    const outputImage = await resizedImage.jpeg().toBuffer();

    await s3Client.putObject({
      Bucket: env.STATIC_BUCKET_NAME,
      Key: record.body,
      Body: outputImage,
      ContentType: "image/jpeg",
    });

    mediaIds.push(record.body);
  }

  await sqsClient.sendMessageBatch({
    QueueUrl: env.MODERATE_QUEUE_NAME,
    Entries: mediaIds.map((mediaId) => ({
      Id: `MEDIA_${mediaId}`,
      MessageBody: mediaId,
    })),
  });
};
