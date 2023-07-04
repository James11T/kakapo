#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import MediaProcessingStack from "../lib/mps/mps-stack";
import AuthStack from "../lib/auth/auth-stack";
import ConstructionStack from "../lib/under-construction/construction-stack";

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? "eu-west-2",
};

const auth = new AuthStack(app, "kakapo-auth-stack", { env });

const mps = new MediaProcessingStack(app, "kakapo-media-processing-stack", {
  env,
});

const construction = new ConstructionStack(app, "kakapo-under-construction", {
  env,
});
