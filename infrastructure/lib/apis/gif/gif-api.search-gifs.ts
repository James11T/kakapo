import {
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from "aws-lambda";
import { getAssertiveEnv } from "../../utils/get-env";
import fetch from "node-fetch";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { TenorResponse } from "./gifTypes";

const { TENOR_CLIENT_KEY, AWS_REGION } = getAssertiveEnv(
  "TENOR_CLIENT_KEY",
  "AWS_REGION"
);

const client = new SecretsManagerClient({
  region: AWS_REGION,
});

const getAWSSecret = async (secretId: string) => {
  const getAPIKeyCommand = new GetSecretValueCommand({
    SecretId: secretId,
  });

  const response = await client.send(getAPIKeyCommand);
  const secretString = response.SecretString;

  if (!secretString) throw new Error(`Secret ${secretId} not set`);

  return secretString;
};

const headers = { "Access-Control-Allow-Origin": "*" };

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters || !event.pathParameters["q"]) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing query parameter" }),
    };
  }

  const TENOR_API_KEY = await getAWSSecret("TENOR_API_KEY");
  const searchTerm = encodeURIComponent(event.pathParameters["q"]);

  console.log(`Searching Tenor for: ${searchTerm}`);

  const response = await fetch(
    `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${TENOR_API_KEY}&client_key=${TENOR_CLIENT_KEY}&limit=30`
  );

  if (response.status !== 200) {
    console.error(await response.text());
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to search GIFs" }),
    };
  }

  const data = (await response.json()) as TenorResponse;

  return {
    statusCode: response.status,
    headers,
    body: JSON.stringify(data.results),
  };
};
