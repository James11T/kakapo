import * as cdk from "aws-cdk-lib";
import {
  aws_cognito as cognito,
  aws_lambda_nodejs as lambdaNodeJS,
  aws_lambda as lambda,
} from "aws-cdk-lib";
import { Construct } from "constructs";

class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const onSignUp = new lambdaNodeJS.NodejsFunction(this, "on-sign-up", {
      runtime: lambda.Runtime.NODEJS_18_X,
    });

    const userPool = new cognito.UserPool(this, "kakapo-user-pool", {
      userPoolName: "kakapo-user-pool",
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
      },
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      standardAttributes: {
        email: {
          required: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      mfa: cognito.Mfa.OPTIONAL,
      email: cognito.UserPoolEmail.withCognito(),
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.userPool = userPool;

    userPool.addTrigger(cognito.UserPoolOperation.PRE_SIGN_UP, onSignUp);

    const webClient = userPool.addClient("kakapo-web-client", {
      userPoolClientName: "kakapo-web-client",
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
    });

    new cdk.CfnOutput(this, "kakapo-user-pool-id", {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "kakapo-web-client-id", {
      value: webClient.userPoolClientId,
    });
  }
}

export default AuthStack;
