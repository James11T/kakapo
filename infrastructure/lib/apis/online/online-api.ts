import * as cdk from "aws-cdk-lib";
import {
  aws_apigateway as apiGateway,
  aws_lambda_nodejs as lambda,
  aws_dynamodb as dynamodb,
} from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface OnlineAPIProps extends cdk.StackProps {
  apiGatewayInstance: apiGateway.RestApi;
}

class OnlineAPI extends Construct {
  public readonly getOnlineStatusFunction: lambda.NodejsFunction;
  public readonly onlineStatusTable: dynamodb.Table;

  constructor(
    scope: Construct,
    id: string,
    { apiGatewayInstance }: OnlineAPIProps
  ) {
    super(scope, id);

    this.onlineStatusTable = new dynamodb.Table(this, "user-online-status", {
      partitionKey: { name: "USER_SUB", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      replicationTimeout: cdk.Duration.hours(1),
    });

    this.getOnlineStatusFunction = new lambda.NodejsFunction(
      this,
      "get-online",
      {
        environment: {
          ONLINE_STATUS_TABLE_NAME: this.onlineStatusTable.tableName,
        },
        runtime: Runtime.NODEJS_18_X,
        memorySize: 128,
      }
    );

    const onlineResource = apiGatewayInstance.root.addResource("online");
    const queryResource = onlineResource.addResource("{q}");

    const apiLambdaIntegration = new apiGateway.LambdaIntegration(
      this.getOnlineStatusFunction
    );

    queryResource.addMethod("GET", apiLambdaIntegration);

    this.onlineStatusTable.grantReadData(this.getOnlineStatusFunction);
  }
}

export default OnlineAPI;
export { OnlineAPIProps as GIF_APIProps };
