import { ECSClient, UpdateServiceCommand } from '@aws-sdk/client-ecs';
import { formatJsonError, formatJsonResponse, ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { buildClusterArn, getServiceName } from '@libs/ecs';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const stop: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (event) => {
  const client = new ECSClient({ region: process.env.REGION });
  const clusterName = event.body.clusterName;

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
