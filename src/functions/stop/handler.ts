import { ECSClient, UpdateServiceCommand } from '@aws-sdk/client-ecs';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJsonError, formatJsonResponse } from '@libs/api-gateway';
import { buildClusterArn, getServiceName } from '@libs/ecs';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const stop: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const client = new ECSClient({ region: process.env.REGION });
  const clusterName = event.queryStringParameters.clusterName;

  const serviceName = await getServiceName(clusterName);

  const updateServiceCommand = new UpdateServiceCommand({
    cluster: buildClusterArn(clusterName),
    service: serviceName,
    desiredCount: 0,
  });

  return client
    .send(updateServiceCommand)
    .then((res) => {
      return formatJsonResponse({
        message: 'Success',
        data: res,
      });
    })
    .catch((err) => {
      console.error(err);
      return formatJsonError(err);
    });
};

export const main = middyfy(stop);
