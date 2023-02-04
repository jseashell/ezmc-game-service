import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedApiGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventApiGatewayProxyEvent<S> = Handler<ValidatedApiGatewayProxyEvent<S>, APIGatewayProxyResult>;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const formatJsonResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify(response),
  };
};

/**
 * Formats the given error as a Lambda proxy response
 * @param {number} statusCode
 * @param {object} error
 * @returns the response
 */
export const formatJsonError = (error) => {
  return {
    statusCode: 500,
    headers: cors,
    body: JSON.stringify({ error }),
  };
};
