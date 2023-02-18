import { S3 } from "@aws-sdk/client-s3";
import { Context, SQSEvent } from "aws-lambda";
import { getAssertiveEnv } from "./get-env";

const env = getAssertiveEnv("STATIC_BUCKET_NAME");

const s3Client = new S3({});

export const handler = async (event: SQSEvent, context: Context) => {
  await s3Client.deleteObjects({
    Bucket: env.STATIC_BUCKET_NAME,
    Delete: {
      Objects: event.Records.map((record) => ({ Key: record.body })),
    },
  });
};
