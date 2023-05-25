#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from '../lib/LambdaStack';
import { ApiStack } from '../lib/ApiStack';

const app = new cdk.App();

const dynamoLambda = new LambdaStack(app, 'EmiHelloCDKLambdaStack');

new ApiStack(app, 'emiapistack', {
  lambdaIntegration:dynamoLambda.lambdaIntegration
});