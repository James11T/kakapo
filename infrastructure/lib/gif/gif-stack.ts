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

    const tenorAPIKeySecret = secretsManager.Secret.fromSecretNameV2(
      this,
      "kakapo-tenor-api-key",
      "TENOR_API_KEY"
    );

    const searchGIFsFunction = new lambda.NodejsFunction(this, "search-gifs", {
      environment: {
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
    const apiLambdaIntegration = new apiGateway.LambdaIntegration(
      searchGIFsFunction
    );
    queryResource.addMethod("GET", apiLambdaIntegration);

    tenorAPIKeySecret.grantRead(searchGIFsFunction);
  }
}

export default GIFStack;
