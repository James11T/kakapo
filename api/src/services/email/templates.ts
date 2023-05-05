import fs from "fs";
import handlebars from "handlebars";
import { FAIL_EMOJI, IPToCountryEmoji } from "../../utils/ip.js";
import { sendEmail } from "../ses.service.js";
import type { EmailOptions } from "../ses.service.js";
import type { TemplateDelegate } from "handlebars";

const NO_FALLBACK =
  "This email is HTML only. If you can't see the HTML version of this email then you may need to update your email client preferences.";

const TEMPLATE_DIR = "src/email/views/";

interface APITemplate {
  render: TemplateDelegate;
  fallback: TemplateDelegate;
}

interface Templates {
  [key: string]: APITemplate;
}

handlebars.registerPartial(
  "base",
  handlebars.compile(fs.readFileSync(`${TEMPLATE_DIR}base.hbs`, "utf8"))
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

  if (!fs.existsSync(dirName)) {
    fallback = NO_FALLBACK;
  } else {
    fallback = fs.readFileSync(`${TEMPLATE_DIR}${dirName}/fallback.txt`, "utf8");
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
  const template = fs.readFileSync(`${TEMPLATE_DIR}${dirName}/template.hbs`, "utf8");

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
  const templateFolders = fs
    .readdirSync(TEMPLATE_DIR, { withFileTypes: true })
    .filter((path) => path.isDirectory());

  templateFolders.forEach((templateDir) => {
    try {
      const template = loadTemplate(templateDir.name);
      templates[templateDir.name] = template;
    } catch (error) {
      console.error(`Failed to load template: ${templateDir.name}`);
    }
  });

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
const sendTemplate = async (
  to: string | string[],
  templateName: string,
  templateContext: any,
  options: Partial<EmailOptions>
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

  await sendEmail(to, {
    ...options,
    html,
    text,
  });
};

const templates = loadTemplates();

export { sendTemplate };

// LATO and Raleway
