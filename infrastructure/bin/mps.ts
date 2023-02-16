#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MpsStack } from "../lib/mps-stack";

const app = new cdk.App();
new MpsStack(app, "media-processing-stack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "eu-west-2",
  },
});
