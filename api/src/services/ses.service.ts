import SES from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import nodemailer from "nodemailer";
import { RUNTIME_CONSTANTS, WEB_CONSTANTS } from "../config.js";
import logger from "../logging.js";
import type { Attachment } from "nodemailer/lib/mailer";
import type { Options } from "nodemailer/lib/mailer";

const { AWS_REGION } = process.env;

interface EmailOptions {
  name: string;
  user: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
}

const ses = new SES.SESClient({
  apiVersion: "latest",
  region: AWS_REGION,
  credentialDefaultProvider: defaultProvider,
});

const transporter = nodemailer.createTransport({
  SES: { ses, aws: SES },
  sendingRate: 1,
});

const defaultOptions: EmailOptions = {
  name: "Kakapo",
  user: "no-reply",
  subject: "Kakapo Social Update",
};

/**
 * Send an email with the given options
 *
 * @param to Email recipient(s)
 * @param options Additional email options
 */
const sendEmail = async (to: string | string[], options: Partial<EmailOptions> = {}) => {
  const combinedOptions: EmailOptions = { ...defaultOptions, ...options };

  const emailOptions: Options = {
    from: {
      name: combinedOptions.name,
      address: `${combinedOptions.user}@${WEB_CONSTANTS.MAIL_SUBDOMAIN}.${WEB_CONSTANTS.DOMAIN}`,
    },
    to,
    subject: combinedOptions.subject,
    text: combinedOptions.text,
    html: combinedOptions.html,
    attachments: combinedOptions.attachments,
  };

  if (!RUNTIME_CONSTANTS.CAN_SEND_EMAILS) {
    logger.debug("Email not sent", { to });
    return;
  }

  logger.debug(`Sending email to ${to}`);

  await transporter.sendMail(emailOptions);
};

export { sendEmail };
export type { EmailOptions };
