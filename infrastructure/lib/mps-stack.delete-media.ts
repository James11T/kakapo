import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import getAssertiveEnv from "./get-env";

const env = getAssertiveEnv("STATIC_BUCKET_NAME");

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World",
    }),
  };
};
