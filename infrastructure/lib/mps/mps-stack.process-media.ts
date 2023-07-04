import { Context, S3Event, SQSEvent } from "aws-lambda";
import { S3 } from "@aws-sdk/client-s3";
import { getAssertiveEnv } from "../utils/get-env";
import sharp from "sharp";
import { SQS } from "@aws-sdk/client-sqs";

const env = getAssertiveEnv(
  "STATIC_BUCKET_NAME",
  "RAW_BUCKET_NAME",
  "MODERATE_QUEUE_NAME"
);

const s3Client = new S3({});
const sqsClient = new SQS({});

const handleS3Event = async (
  event: S3Event,
  context: Context
): Promise<string[]> => {
  const mediaIds: string[] = [];

  for (const record of event.Records) {
    const key = record.s3.object.key;

    const rawImage = await s3Client.getObject({
      Bucket: env.RAW_BUCKET_NAME,
      Key: key,
    });

    if (!rawImage.Body) continue;

    const body = await rawImage.Body.transformToByteArray();
    const sharpImage = sharp(body);
    const metadata = await sharpImage.metadata();
    const resizedImage = sharpImage.resize(
      Math.min(720, metadata.width ?? Number.MAX_SAFE_INTEGER)
    );
    const outputImage = await resizedImage.png().toBuffer();

    await s3Client.putObject({
      Bucket: env.STATIC_BUCKET_NAME,
      Key: key,
      Body: outputImage,
      ContentType: "image/png",
    });

    mediaIds.push(key);
  }

  return mediaIds;
};

export const handler = async (event: SQSEvent, context: Context) => {
  const mediaIds: string[] = [];

  for (const record of event.Records) {
    const event: S3Event = JSON.parse(record.body);

    const newIds = await handleS3Event(event, context);
    mediaIds.push(...newIds);
  }

  await sqsClient.sendMessageBatch({
    QueueUrl: env.MODERATE_QUEUE_NAME,
    Entries: mediaIds.map((mediaId) => ({
      Id: `MEDIA_${mediaId}`,
      MessageBody: mediaId,
    })),
  });
};
