import {
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from "aws-lambda";
import { getAssertiveEnv } from "../../utils/get-env";
import {
  DynamoDB,
  BatchGetItemCommand,
  BatchGetItemCommandInput,
} from "@aws-sdk/client-dynamodb";

const { ONLINE_STATUS_TABLE_NAME } = getAssertiveEnv(
  "ONLINE_STATUS_TABLE_NAME"
);

const dynamoDBClient = new DynamoDB({});

const headers = { "Access-Control-Allow-Origin": "*" };

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const queryParams = event.queryStringParameters || {};
  const keys = queryParams.q ? queryParams.q.split(",") : [];

  const batchGetItemInput: BatchGetItemCommandInput = {
    RequestItems: {
      [ONLINE_STATUS_TABLE_NAME]: {
        Keys: keys.map((key) => ({ YourPrimaryKeyName: { S: key } })),
      },
    },
  };

  // Fetching items from DynamoDB
  const response = await dynamoDBClient.send(
    new BatchGetItemCommand(batchGetItemInput)
  );

  // Extract the results and send them back
  const items = response.Responses
    ? response.Responses[ONLINE_STATUS_TABLE_NAME]
    : [];

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(items),
  };
};
