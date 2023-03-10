import { CloudFormationClient, DeleteStackCommand } from '@aws-sdk/client-cloudformation';
import type { ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { formatJsonError, formatJsonResponse } from '@libs/api-gateway';
import { formatStackName } from '@libs/ecs';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const down: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (event) => {
  const accountId = event.body.accountId;
  const serverName = event.body.serverName;
  const stackName = formatStackName(accountId, serverName);

  const client = new CloudFormationClient({ region: process.env.REGION });

  const command = new DeleteStackCommand({
    StackName: stackName,
  });

  return client
    .send(command)
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

export const main = middyfy(down);
