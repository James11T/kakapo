import { Construct } from "constructs";
import { Stack, StackProps, Duration, RemovalPolicy } from "aws-cdk-lib";
import {
  aws_s3 as s3,
  aws_sqs as sqs,
  aws_dynamodb as dynamodb,
  aws_lambda_nodejs as lambda,
  aws_apigateway as apiGateway,
  aws_lambda_event_sources as lambdaEvents,
  aws_iam as iam,
} from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class MpsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Queue for images waiting to be processed
    const processQueue = new sqs.Queue(this, "process-media-queue", {
      visibilityTimeout: Duration.minutes(2),
    });

    // Queue for images to be moderated by rekognition
    const moderateQueue = new sqs.Queue(this, "moderate-media-queue", {
      visibilityTimeout: Duration.minutes(2),
    });

    // Queue for images to be deleted
    const deletionQueue = new sqs.Queue(this, "delete-media-queue", {
      visibilityTimeout: Duration.minutes(2),
    });

    // Holds all media before they have been converted and resized
    const rawBucket = new s3.Bucket(this, "media-raw", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          enabled: true,
          expiration: Duration.days(1),
        },
      ],
    });

    // Holds all media after they have been converted and resized
    const staticBucket = new s3.Bucket(this, "media-static", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Hold the output of rekognition
    const moderationResultsTable = new dynamodb.Table(this, "moderation-results", {
      partitionKey: { name: "MEDIA_ID", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      replicationTimeout: Duration.hours(1),
    });

    // Handle HTTP requests via API gateway
    const handleAPIInvokeFunction = new lambda.NodejsFunction(this, "api-invoke", {
      environment: {
        RAW_BUCKET_NAME: rawBucket.bucketName,
        STATIC_BUCKET_NAME: staticBucket.bucketName,
        PROCESS_MEDIA_QUEUE_URL: processQueue.queueUrl,
        DELETE_MEDIA_QUEUE_URL: deletionQueue.queueUrl,
      },
      runtime: Runtime.NODEJS_18_X,
    });

    // Convert and resize media
    const processMediaFunction = new lambda.NodejsFunction(this, "process-media", {
      environment: {
        STATIC_BUCKET_NAME: staticBucket.bucketName,
        RAW_BUCKET_NAME: rawBucket.bucketName,
        MODERATE_QUEUE_NAME: moderateQueue.queueName,
      },
      runtime: Runtime.NODEJS_18_X,
      memorySize: 1536,
      bundling: {
        nodeModules: ["sharp"],
      },
    });

    // Run media through rekognition, delete them if necessary
    const moderateMediaFunction = new lambda.NodejsFunction(this, "moderate-media", {
      environment: {
        STATIC_BUCKET_NAME: staticBucket.bucketName,
        MODERATION_OUTPUT_TABLE_NAME: moderationResultsTable.tableName,
        DELETE_QUEUE_URL: deletionQueue.queueUrl,
      },
      runtime: Runtime.NODEJS_18_X,
    });

    // Handle deleting media from static bucket
    const deleteMediaFunction = new lambda.NodejsFunction(this, "delete-media", {
      environment: {
        STATIC_BUCKET_NAME: staticBucket.bucketName,
      },
    });

    // Handle incoming requests
    const processRestAPI = new apiGateway.LambdaRestApi(this, "invoke-api", {
      handler: handleAPIInvokeFunction,
      proxy: false,
      binaryMediaTypes: ["*/*"],
    });

    const mediaRoute = processRestAPI.root.addResource("media");
    mediaRoute.addMethod("POST");

    const apiGatewayRole = new iam.Role(this, "api-gateway-role", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    });

    //GetObject method
    apiGatewayRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["s3:GetObject"],
      })
    );

    const getObjectIntegration = new apiGateway.AwsIntegration({
      service: "s3",
      path: `${staticBucket.bucketName}/{id}`,
      integrationHttpMethod: "GET",
      options: {
        contentHandling: apiGateway.ContentHandling.CONVERT_TO_BINARY,
        credentialsRole: apiGatewayRole,
        passthroughBehavior: apiGateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
        requestParameters: {
          "integration.request.path.id": "method.request.path.id",
        },
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Content-Type": "integration.response.header.Content-Type",
            },
          },
        ],
      },
    });

    //GetObject method options
    const getObjectMethodOptions: apiGateway.MethodOptions = {
      authorizationType: apiGateway.AuthorizationType.NONE,
      requestParameters: {
        "method.request.path.id": true,
      },
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Content-Type": true,
          },
        },
      ],
    };

    const specificMedia = mediaRoute.addResource("{id}");
    specificMedia.addMethod("GET", getObjectIntegration, getObjectMethodOptions);
    specificMedia.addMethod("DELETE");

    const handleProcessQueue = new lambdaEvents.SqsEventSource(processQueue);
    processMediaFunction.addEventSource(handleProcessQueue);

    const handleDeleteQueue = new lambdaEvents.SqsEventSource(deletionQueue);
    deleteMediaFunction.addEventSource(handleDeleteQueue);

    const handleModerateQueue = new lambdaEvents.SqsEventSource(moderateQueue);
    moderateMediaFunction.addEventSource(handleModerateQueue);

    moderateMediaFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["rekognition:DetectModerationLabels"],
        resources: ["*"],
      })
    );

    moderateMediaFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["ssm:GetParameter", "ssm:GetParameters"],
        resources: [`arn:aws:ssm:${this.region}:${this.account}:parameter/kakapo*`],
      })
    );

    rawBucket.grantPut(handleAPIInvokeFunction);
    staticBucket.grantRead(handleAPIInvokeFunction);
    processQueue.grantSendMessages(handleAPIInvokeFunction);

    moderateQueue.grantSendMessages(processMediaFunction);
    staticBucket.grantPut(processMediaFunction);
    rawBucket.grantRead(processMediaFunction);

    staticBucket.grantRead(moderateMediaFunction);
    deletionQueue.grantSendMessages(moderateMediaFunction);
    moderationResultsTable.grantWriteData(moderateMediaFunction);

    staticBucket.grantDelete(deleteMediaFunction);
  }
}
