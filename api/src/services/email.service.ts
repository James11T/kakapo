import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import logger from "../logging.js";
import { FAIL_EMOJI, IPToCountryEmoji } from "../utils/ip.js";
import { TEMPLATE_NAMES } from "../views/templates.js";
import { sendEmail } from "./ses.service.js";
import type { EmailOptions } from "./ses.service.js";
import type { TemplateContextMap, TemplateName } from "../views/templates.js";
import type { TemplateDelegate } from "handlebars";
import { RUNTIME_CONSTANTS } from "../config.js";

const NO_FALLBACK =
  "This email is HTML only. If you can't see the HTML version of this email then you may need to update your email client preferences.";

const TEMPLATE_DIR = path.join(process.cwd(), "src/views");

interface APITemplate {
  render: TemplateDelegate;
  fallback: TemplateDelegate;
}

interface Templates {
  [key: string]: APITemplate;
}

handlebars.registerPartial(
  "base",
  handlebars.compile(fs.readFileSync(path.join(TEMPLATE_DIR, "base.hbs"), "utf8"))
);

/**
 * Load the text fallback for a HTML email template
 * If one does not exist then return the default fallback
 *
 * @param dirName Template directory name
 * @returns Fallback template function
 */
const loadFallback = (dirName: string) => {
  let fallback: string;

  if (!fs.existsSync(path.join(TEMPLATE_DIR, dirName))) {
    fallback = NO_FALLBACK;
  } else {
    fallback = fs.readFileSync(path.join(TEMPLATE_DIR, dirName, "/fallback.txt"), "utf8");
  }

  return handlebars.compile(fallback);
};

/**
 *  Load a template directory from disk
 *
 * @param dirName Template directory name, must contain template.hbs
 * @returns Template file render function with a list of attachments
 */
const loadTemplate = (dirName: string): APITemplate => {
  const template = fs.readFileSync(path.join(TEMPLATE_DIR, dirName, "/template.hbs"), "utf8");

  const render = handlebars.compile(template);
  const fallback = loadFallback(dirName);

  return { render, fallback };
};

/**
 * Load all template files from disk and compile them into usable templates
 *
 * @returns A map of template file names to template functions
 */
const loadTemplates = () => {
  const templates: Templates = {};

  // Get all directory names in the template directory
  const templateFolders = TEMPLATE_NAMES;

  for (const name of templateFolders) {
    try {
      const template = loadTemplate(name);
      templates[name] = template;
    } catch (error) {
      logger.error(`Failed to load templates`, { error: String(error) });
    }
  }

  logger.debug(`Loaded ${Object.keys(templates).length} email templates`);

  return templates;
};

/**
 * Render from a template and send an email
 *
 * @param to Email recipient(s)
 * @param templateName Email template name
 * @param templateContext Context to pass to the template
 * @param options Additional email options
 */
const sendTemplate = async <T extends TemplateName>(
  to: string | string[],
  templateName: T,
  templateContext: TemplateContextMap[T],
  options: Partial<EmailOptions> = {}
) => {
  const loadedTemplate = templates[templateName];

  if (templateContext.ip) {
    try {
      const ipFlag = IPToCountryEmoji(templateContext.ip);
      templateContext = { ...templateContext, flag: ipFlag };
    } catch {
      templateContext = { ...templateContext, flag: FAIL_EMOJI };
    }
  }

  const html = loadedTemplate.render({ ...templateContext });
  const text = loadedTemplate.fallback(templateContext);

  if (!RUNTIME_CONSTANTS.CAN_SEND_EMAILS) {
    logger.debug("Email not sent", { context: templateContext });
    return;
  }

  await sendEmail(to, {
    ...options,
    html,
    text,
  });
};

const templates = loadTemplates();

export { sendTemplate };
