import * as cdk from "aws-cdk-lib";
import { aws_apigateway as apiGateway } from "aws-cdk-lib";
import { Construct } from "constructs";
import GIF_API from "./gif/gif-api";
import onlineAPI from "./online/online-api";

class APISStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apiGateway.RestApi(this, "kakapo-apis", {
      restApiName: "API Gateway for Kakapo Microservices",
      description: "This service exposes multiple Kakapo microservices.",
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS,
        allowMethods: apiGateway.Cors.ALL_METHODS,
      },
    });

    new GIF_API(this, "kakapo-gif-api", {
      apiGatewayInstance: api,
    });

    new onlineAPI(this, "kakapo-online-api", {
      apiGatewayInstance: api,
    });
  }
}

export default APISStack;
