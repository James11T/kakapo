import SES from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import nodemailer from "nodemailer";
import { RUNTIME_CONSTANTS, WEB_CONSTANTS } from "../config.js";
import logger from "../logging.js";
import type { Attachment } from "nodemailer/lib/mailer";

const { AWS_REGION, WEB_DOMAIN } = process.env;

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
  if (!RUNTIME_CONSTANTS.CAN_SEND_EMAILS) {
    logger.debug(`Not sending email to ${to} in dev.`);
    return;
  }

  const combinedOptions: EmailOptions = { ...defaultOptions, ...options };

  logger.debug(`Sending email to ${to}`);

  await transporter.sendMail({
    from: {
      name: combinedOptions.name,
      address: `${combinedOptions.user}@${WEB_CONSTANTS.MAIL_SUBDOMAIN}.${WEB_DOMAIN}`,
    },
    to,
    subject: combinedOptions.subject,
    text: combinedOptions.text,
    html: combinedOptions.html,
    attachments: combinedOptions.attachments,
  });
};

export { sendEmail };
export type { EmailOptions };
