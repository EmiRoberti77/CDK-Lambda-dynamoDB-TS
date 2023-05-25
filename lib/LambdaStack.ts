import { Construct } from 'constructs';
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';

import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import {Runtime, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs"
import * as path from 'path';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export class LambdaStack extends Stack {
  private TABLE_NAME = 'cdkHelloTable';
  private TABLE_ARN = 'arn:aws:dynamodb:us-east-1:432599188850:table/CdkTypescriptStack-cdkHelloTableA8F0CB64-7IDLWV0CAWO7';
  //private AWS_REGION = 'us-east-1';
  public lambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Dynamodb table definition
    const table = new Table(this, this.TABLE_NAME, {
      partitionKey: { name: "name", type: AttributeType.STRING },
      tableName: this.TABLE_NAME
    });

    // lambda function
    const dynamoLambda = new NodejsFunction(this, "HelloDynamoLambda", {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, `/../functions/function.ts`),
      handler: "handler",
      environment: {
        HELLO_TABLE_NAME: this.TABLE_NAME,
      },
    });

    dynamoLambda.addToRolePolicy( new PolicyStatement({
      effect:Effect.ALLOW,
      resources: [this.TABLE_ARN],
      actions:[
        'dynamodb:PutItem',
        'dynamodb:Scan',
        'dynamodb:GetItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem'
      ]
    }))

    // permissions to lambda to dynamo table
    table.grantReadWriteData(dynamoLambda);

    const myFunctionUrl = dynamoLambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
      }
    });

    new CfnOutput(this, 'FunctionUrl', {
      value: myFunctionUrl.url,
    });

    this.lambdaIntegration = new LambdaIntegration(dynamoLambda);
  }
}
