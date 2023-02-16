import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as lambdaEvents from "aws-cdk-lib/aws-lambda-event-sources";
import * as iam from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class MpsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Queue for images waiting to be processed
    const processQueue = new sqs.Queue(this, "process-media-queue", {
      visibilityTimeout: cdk.Duration.minutes(2),
    });

    // Queue for images to be moderated by rekognition
    const moderateQueue = new sqs.Queue(this, "moderate-media-queue", {
      visibilityTimeout: cdk.Duration.minutes(2),
    });

    // Queue for images to be deleted
    const deletionQueue = new sqs.Queue(this, "delete-media-queue", {
      visibilityTimeout: cdk.Duration.minutes(2),
    });

    // Holds all media before they have been converted and resized
    const rawBucket = new s3.Bucket(this, "media-raw", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          enabled: true,
          expiration: cdk.Duration.days(1),
        },
      ],
    });

    // Holds all media after they have been converted and resized
    const staticBucket = new s3.Bucket(this, "media-static", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Hold the output of rekognition
    const moderationResultsTable = new dynamodb.Table(this, "moderation-results", {
      partitionKey: { name: "media-id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      replicationTimeout: cdk.Duration.hours(1),
    });

    // Handle HTTP requests via API gateway
    const handleAPIInvokeFunction = new lambda.NodejsFunction(this, "api-invoke", {
      environment: {
        RAW_BUCKET_NAME: rawBucket.bucketName,
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
      },
      runtime: Runtime.NODEJS_18_X,
      memorySize: 1536,
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
      proxy: true,
    });

    const handleProcessQueue = new lambdaEvents.SqsEventSource(processQueue);
    processMediaFunction.addEventSource(handleProcessQueue);

    const handleDeleteQueue = new lambdaEvents.SqsEventSource(deletionQueue);
    deleteMediaFunction.addEventSource(handleDeleteQueue);

    const handleModerateQueue = new lambdaEvents.SqsEventSource(moderateQueue);
    moderateMediaFunction.addEventSource(handleModerateQueue);

    handleAPIInvokeFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["sqs:SendMessage"],
        resources: [processQueue.queueArn, deletionQueue.queueArn],
      })
    );

    rawBucket.grantPut(handleAPIInvokeFunction);
    processQueue.grantSendMessages(handleAPIInvokeFunction);

    staticBucket.grantPut(processMediaFunction);
    rawBucket.grantRead(processMediaFunction);
    moderationResultsTable.grantWriteData(processMediaFunction);
  }
}
