import * as cdk from "aws-cdk-lib";
import {
  aws_lambda_nodejs as lambda,
  aws_apigateway as apiGateway,
  aws_secretsmanager as secretsManager,
} from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

class GIFStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const TENOR_API_KEY = secretsManager.Secret.fromSecretAttributes(
      this,
      "tenor-api-key",
      {
        secretCompleteArn:
          "arn:aws:secretsmanager:eu-west-2:653112935782:secret:TENOR_API_KEY-wG3CU9",
      }
    );

    console.log(TENOR_API_KEY.secretValue.toString());

    const searchGIFs = new lambda.NodejsFunction(this, "search-gifs", {
      environment: {
        TENOR_API_KEY: TENOR_API_KEY.secretValue.unsafeUnwrap(),
        TENOR_CLIENT_KEY: "kakapo_gif",
      },
      runtime: Runtime.NODEJS_18_X,
      memorySize: 128,
    });

    const api = new apiGateway.RestApi(this, "gif-api", {
      restApiName: "Tenor GIF Service",
      description: "This service exposes a Tenor Search Proxy.",
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS,
        allowMethods: apiGateway.Cors.ALL_METHODS,
      },
    });

    const queryResource = api.root.addResource("{q}");
    const apiLambdaIntegration = new apiGateway.LambdaIntegration(searchGIFs);
    queryResource.addMethod("GET", apiLambdaIntegration);
  }
}

export default GIFStack;
