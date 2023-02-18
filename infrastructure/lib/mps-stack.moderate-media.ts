import { Rekognition } from "@aws-sdk/client-rekognition";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { SSM } from "@aws-sdk/client-ssm";
import { SQS } from "@aws-sdk/client-sqs";
import { Context, SQSEvent } from "aws-lambda";
import { getAssertiveEnv } from "./get-env";

const env = getAssertiveEnv(
  "STATIC_BUCKET_NAME",
  "MODERATION_OUTPUT_TABLE_NAME",
  "DELETE_QUEUE_URL"
);

const dynamoDBClient = new DynamoDB({});
const rekognitionClient = new Rekognition({});
const ssmClient = new SSM({});
const sqsClient = new SQS({});

export const handler = async (event: SQSEvent, context: Context) => {
  const restrictedLabels = (
    await ssmClient.getParameter({
      Name: "/kakapo-moderation/restricted-labels",
    })
  ).Parameter?.Value?.split(",");

  const blockedLabels = (
    await ssmClient.getParameter({
      Name: "/kakapo-moderation/blocked-labels",
    })
  ).Parameter?.Value?.split(",");

  if (!restrictedLabels || !blockedLabels) {
    throw new Error("Failed to load moderation labels");
  }

  for (const record of event.Records) {
    const moderation = await rekognitionClient.detectModerationLabels({
      Image: {
        S3Object: {
          Bucket: env.STATIC_BUCKET_NAME,
          Name: record.body,
        },
      },
    });

    const labels = moderation.ModerationLabels?.map((label) => label.Name ?? "Unknown Label") ?? [];

    const isBlocked = labels.some((label) => blockedLabels.includes(label));

    const dynamoParams = {
      TableName: env.MODERATION_OUTPUT_TABLE_NAME,
      Item: {
        MEDIA_ID: { S: record.body },
        IS_RESTRICTED: { BOOL: labels.some((label) => restrictedLabels.includes(label)) },
        IS_BLOCKED: { BOOL: isBlocked },
        DETECTED_LABELS: { L: labels.map((label) => ({ S: label })) },
      },
    };

    await dynamoDBClient.putItem(dynamoParams);

    if (isBlocked) {
      await sqsClient.sendMessage({
        QueueUrl: env.DELETE_QUEUE_URL,
        MessageBody: record.body,
      });
    }
  }
};
