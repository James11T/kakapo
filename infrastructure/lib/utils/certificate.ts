import { aws_certificatemanager as certificateManager } from "aws-cdk-lib";
import { Construct } from "constructs";

const CERTIFICATE_ARN =
  "arn:aws:acm:us-east-1:653112935782:certificate/ae002e24-ee54-4aac-8d5e-e3dbf1aeb8dd";

const getKakapoCertificate = (scope: Construct) =>
  certificateManager.Certificate.fromCertificateArn(
    scope,
    "kakapo-certificate",
    CERTIFICATE_ARN
  );

export { getKakapoCertificate };
