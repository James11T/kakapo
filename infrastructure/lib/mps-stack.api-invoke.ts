import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import getAssertiveEnv from "./get-env";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import createMediaHandle from "./api/create-media.route";

const env = getAssertiveEnv("RAW_BUCKET_NAME", "PROCESS_MEDIA_QUEUE_URL", "DELETE_MEDIA_QUEUE_URL");

type RouteHandle = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

const routeHandles: Record<HttpMethod, Record<string, RouteHandle | undefined>> = {
  GET: {},
  POST: {
    "/media": createMediaHandle,
  },
  PUT: {},
  PATCH: {},
  DELETE: {},
  HEAD: {},
  OPTIONS: {},
};

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const routeHandle = routeHandles[event.httpMethod as HttpMethod][event.path];

  if (!routeHandle) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: `Unknown route ${event.httpMethod} ${event.path}` }),
    };
  }

  try {
    const res = await routeHandle(event, context);
    return res;
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An unexpected error occurred while processing this request",
        message: String(error),
      }),
    };
  }
};
