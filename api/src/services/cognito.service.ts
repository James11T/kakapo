import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  InvalidParameterException,
  PasswordResetRequiredException,
} from "@aws-sdk/client-cognito-identity-provider";
import { APIServerError, APIUnauthorizedError } from "../errors.js";
import logger from "../logging.js";
import type { GetUserCommandOutput } from "@aws-sdk/client-cognito-identity-provider";

const cognito = new CognitoIdentityProviderClient({});

interface CognitoUser
  extends Pick<
    GetUserCommandOutput,
    "MFAOptions" | "PreferredMfaSetting" | "UserAttributes" | "UserMFASettingList"
  > {
  uuid: string;
  email: string;
}

/**
 * Get a Cognito user from an access token
 *
 * @param accessToken
 * @returns Direct cognito output, Username is sub, not email
 */
const getCognitoUser = async (accessToken: string): Promise<CognitoUser> => {
  const command = new GetUserCommand({ AccessToken: accessToken });

  try {
    const user = await cognito.send(command);

    const email = user.UserAttributes?.find((attribute) => attribute.Name === "email")?.Value;

    if (!user.Username || !email) {
      logger.error("Cognito user Username or email key was undefined", {
        ID: "UNEXPECTED_COGNITO_RESPONSE",
        email: email ?? "NOT_SET",
        username: user.Username ?? "NOT_SET",
      });

      throw new APIServerError("AUTHORIZATION_FAILED", "Unexpected authentication result");
    }

    return { ...user, uuid: user.Username, email };
  } catch (error: InvalidParameterException | PasswordResetRequiredException | unknown) {
    if (error instanceof InvalidParameterException) {
      logger.info("An invalid access token was encountered", {
        ID: "BAD_ACCESS_TOKEN",
      });
      throw new APIUnauthorizedError(
        "INVALID_ACCESS_TOKEN",
        "The access token provided was invalid."
      );
    } else if (error instanceof PasswordResetRequiredException) {
      logger.info("User attempted to authenticate but password reset was required", {
        ID: "PASSWORD_RESET_REQUIRED",
      });
      throw new APIUnauthorizedError(
        "PASSWORD_RESET_REQUIRED",
        "You must reset your password before you can continue"
      );
    } else {
      logger.error("Failed to verify access token", {
        ID: "UNEXPECTED_ACCESS_TOKEN_ERROR",
        error: String(error),
      });
      throw new APIServerError("AUTHORIZATION_FAILED", "Failed to verify access token");
    }
  }
};

export { getCognitoUser };
