import * as cdk from "aws-cdk-lib";
import {
  aws_apigateway as apiGateway,
  aws_lambda_nodejs as lambda,
  aws_secretsmanager as secretsManager,
} from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface GIF_APIProps extends cdk.StackProps {
  apiGatewayInstance: apiGateway.RestApi;
}

class GIF_API extends Construct {
  // Public properties for the Construct can be defined here, for example:
  public readonly searchGIFsFunction: lambda.NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { apiGatewayInstance }: GIF_APIProps
  ) {
    super(scope, id);

    const tenorAPIKeySecret = secretsManager.Secret.fromSecretNameV2(
      this,
      "kakapo-tenor-api-key",
      "TENOR_API_KEY"
    );

    this.searchGIFsFunction = new lambda.NodejsFunction(this, "search-gifs", {
      environment: {
        TENOR_CLIENT_KEY: "kakapo_gif",
      },
      runtime: Runtime.NODEJS_18_X,
      memorySize: 128,
    });

    const gifResource = apiGatewayInstance.root.addResource("gif");
    const queryResource = gifResource.addResource("{q}");

    const apiLambdaIntegration = new apiGateway.LambdaIntegration(
      this.searchGIFsFunction
    );

    queryResource.addMethod("GET", apiLambdaIntegration);

    tenorAPIKeySecret.grantRead(this.searchGIFsFunction);
  }
}

export default GIF_API;
export { GIF_APIProps };
