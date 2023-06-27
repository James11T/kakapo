const TEMPLATE_NAMES = [
  "accountDisabled",
  "confirmEmail",
  "MFADisabled",
  "MFAEnabled",
  "resetPassword",
  "welcome",
] as const;

interface MetadataTemplateContext {
  ip?: string;
  flag?: string;
}

interface AccountDisabledTemplateContext extends MetadataTemplateContext {
  name: string;
}

interface ConfirmEmailTemplateContext extends MetadataTemplateContext {
  name: string;
  link: string;
}

interface MFADisabledTemplateContext extends MetadataTemplateContext {
  name: string;
}

interface MFAEnabledTemplateContext extends MetadataTemplateContext {
  name: string;
}

interface ResetPasswordTemplateContext extends MetadataTemplateContext {
  name: string;
  link: string;
}

interface WelcomeTemplateContext extends MetadataTemplateContext {
  name: string;
}

interface TemplateContextMap {
  accountDisabled: AccountDisabledTemplateContext;
  confirmEmail: ConfirmEmailTemplateContext;
  MFADisabled: MFADisabledTemplateContext;
  MFAEnabled: MFAEnabledTemplateContext;
  resetPassword: ResetPasswordTemplateContext;
  welcome: WelcomeTemplateContext;
}

type TemplateContexts = TemplateContextMap[keyof TemplateContextMap];
type TemplateName = (typeof TEMPLATE_NAMES)[number];

export { TEMPLATE_NAMES };
export type { TemplateContextMap, TemplateContexts, TemplateName };
