import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import {
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontOrigin,
  aws_route53 as route53,
  aws_route53_targets as route53t,
  aws_s3_deployment as s3Deployment,
} from "aws-cdk-lib";
import { getKakapoCertificate } from "../utils/certificate";
import path from "path";

const DOMAIN = "kakaposocial.com";

class ConstructionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const certificate = getKakapoCertificate(this);

    const bucket = new s3.Bucket(this, "construction-static", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });

    new s3Deployment.BucketDeployment(this, "deploy-assets", {
      sources: [s3Deployment.Source.asset(path.join(__dirname, "static"))],
      destinationBucket: bucket,
    });

    const hostedZone = route53.HostedZone.fromLookup(
      this,
      "construction-hosted-zone",
      {
        domainName: DOMAIN,
      }
    );

    const distribution = new cloudfront.Distribution(
      this,
      "construction-distribution",
      {
        certificate,
        domainNames: [DOMAIN, `www.${DOMAIN}`],
        defaultBehavior: {
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          origin: new cloudfrontOrigin.S3Origin(bucket),
        },
        defaultRootObject: "index.html",
      }
    );

    const target = new route53t.CloudFrontTarget(distribution);

    new route53.ARecord(this, "media-record-root", {
      zone: hostedZone,
      recordName: DOMAIN,
      target: route53.RecordTarget.fromAlias(target),
    });

    new route53.ARecord(this, "media-record-www", {
      zone: hostedZone,
      recordName: `www.${DOMAIN}`,
      target: route53.RecordTarget.fromAlias(target),
    });
  }
}

export default ConstructionStack;
