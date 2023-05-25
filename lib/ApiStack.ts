import { Stack, StackProps } from "aws-cdk-lib";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import {ResourceOptions} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps{
  lambdaIntegration:LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope:Construct, id:string, props:ApiStackProps){
    super(scope, id, props);

    const api = new RestApi(this, 'emiapi');

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions:{
        allowOrigins:Cors.ALL_ORIGINS,
        allowMethods:Cors.ALL_METHODS
      }
    }

    const emiapiResources = api.root.addResource('emi', optionsWithCors);
    emiapiResources.addMethod('POST', props.lambdaIntegration)
    emiapiResources.addMethod('GET', props.lambdaIntegration)
  }
}