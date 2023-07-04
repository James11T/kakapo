import type { Context, PreSignUpTriggerEvent } from "aws-lambda";
import fetch from "node-fetch";

export const handler = async (
  event: PreSignUpTriggerEvent,
  context: Context
): Promise<PreSignUpTriggerEvent> => {
  const { userAttributes } = event.request;

  await fetch(
    "https://discord.com/api/webhooks/1122327519576727562/ThQXxXYNb0VtP3_pG2ow_zLvLkdbSyLopuYx2-MKdQvotPf5gP1mQPSQ9FcQWsGNgnea",
    {
      method: "POST",
      body: JSON.stringify({
        embeds: [
          {
            title: "New Kakapo Sign Up",
            description: userAttributes.email,
          },
        ],
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  return event;
};
