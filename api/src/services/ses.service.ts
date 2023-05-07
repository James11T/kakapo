import AWS from "aws-sdk";
import nodemailer from "nodemailer";
import { RUNTIME_CONSTANTS, WEB_CONSTANTS } from "../config.js";
import logger from "../logging.js";
import type { Attachment } from "nodemailer/lib/mailer";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, WEB_DOMAIN } = process.env;

interface EmailOptions {
  name: string;
  user: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
}

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "latest", sslEnabled: true });

const transporter = nodemailer.createTransport({
  SES: ses,
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
