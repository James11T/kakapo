import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { SQS } from "@aws-sdk/client-sqs";
import { S3 } from "@aws-sdk/client-s3";
import { v4 as uuid4 } from "uuid";
import { z } from "zod";
import { getAssertiveEnv } from "../get-env";

const bodySchema = z.object({
  media: z.string().array().min(1),
});

const env = getAssertiveEnv("PROCESS_MEDIA_QUEUE_URL", "RAW_BUCKET_NAME");

const sqsClient = new SQS({});
const s3Client = new S3({});

const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Request body was missing",
      }),
    };
  }

  let rawBody: object;
  try {
    rawBody = JSON.parse(Buffer.from(event.body, "base64").toString("utf-8"));
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Request body contained invalid JSON",
      }),
    };
  }

  const body = bodySchema.safeParse(rawBody);
  if (!body.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Request body was malformed",
        issues: body.error.issues,
        isZod: true,
      }),
    };
  }

  const mediaIds: string[] = [];
  try {
    for (const media of body.data.media) {
      const mediaId = uuid4();

      await s3Client.putObject({
        Bucket: env.RAW_BUCKET_NAME,
        Key: mediaId,
        Body: Buffer.from(media),
      });

      mediaIds.push(mediaId);
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to upload media" }),
    };
  }

  try {
    await sqsClient.sendMessageBatch({
      QueueUrl: env.PROCESS_MEDIA_QUEUE_URL,
      Entries: mediaIds.map((mediaId) => ({ Id: `media_${mediaId}`, MessageBody: mediaId })),
    });
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to invoke process queue" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ mediaIds }),
  };
};

export default handler;
