import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';

import {DynamoDBClient, PutItemCommand, GetItemCommand, AttributeValue} from '@aws-sdk/client-dynamodb'

const awsConfigs = {
  tablename:'CdkTypescriptStack-cdkHelloTableA8F0CB64-7IDLWV0CAWO7',
  awsregion :'us-east-1'
}

const dynamo = new DynamoDBClient({
  region: awsConfigs.awsregion})

enum Http {
  POST='POST',
  GET='GET'
}

interface Person {
  name:string;
}

export const handler = async (event:APIGatewayProxyEvent, context:Context):Promise<APIGatewayProxyResult> => {

    console.log('in lambda tablename=',awsConfigs.tablename);

    const method = event.httpMethod
    console.log('method',method)

    if (method === Http.GET) {
        return await getHello(event)
     } else if (method === Http.POST) {
        return await saveItem(event);
     } else {
         return {
             statusCode: 400, 
             body: JSON.stringify({
               message:`Error no ${Http} found`
             })
         };
     }  
};
  
async function getHello(event : any ) {
    
    const name = event.queryStringParameters.name;
    const item = await getItem(name);

      return {
        statusCode: 200,
        body: JSON.stringify(item.body),
      };
  };
  
async function getItem(name : string ):Promise<APIGatewayProxyResult> {
  const result = await dynamo.send(new GetItemCommand({
    TableName: awsConfigs.tablename,
    Key: {
      name: {
        S: name
      } as AttributeValue
    }
  }));

  if(result.Item){
    return {
      statusCode: 200,
      body:JSON.stringify({
        message:result.Item
      })
    }
  } 

  return{
    statusCode: 400,
    body:JSON.stringify({
      message: `failed to get data for ${name} ( table - ${awsConfigs.tablename})`
    })
  }
}
  
async function saveItem(event : APIGatewayProxyEvent):Promise<APIGatewayProxyResult> {

  console.log('in saveItem lambda =>', event);
  console.log('in saveItem event.body =>', event.body);
  console.log('V3')

  try {
  const result = await dynamo.send(new PutItemCommand({
      TableName: awsConfigs.tablename, 
      Item: {
        name: {
          S: event.queryStringParameters!.name!
        }
      }
    }));
    
    console.log(result)

    return{
      statusCode:200,
      body:JSON.stringify({
        message:result
      })
    };

  } catch(err) {
    console.log(err);
  }

  return {
    statusCode:501,
    body:JSON.stringify({
      message:'Error for saving data'
    })
  };
}