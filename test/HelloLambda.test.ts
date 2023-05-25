import {handler} from '../functions/function'
import {APIGatewayProxyEvent} from 'aws-lambda'

const event = {
  httpMethod: 'POST',
  body: JSON.stringify({
    name: 'emi - test lambda'
  }),
  queryStringParameters:{
    name:'franco'
  }
}

console.log('started lambda test')
handler(event as any, {} as any)
console.log('ended lambda test')