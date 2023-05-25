import { APIGatewayEvent } from "aws-lambda";
import { handler } from "../functions/function";

const event= {
  httpMethod: 'GET',
  queryStringParameters:{
    name:'emi roberti'
  }
} as any

const context:any = {}

console.log('starting test on getName')
handler(event, context)
.then((success)=>{
  console.log(success)
})
.catch((err)=>{
  console.log(err)
})
