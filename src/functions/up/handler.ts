import { CloudFormationClient, CreateStackCommand } from '@aws-sdk/client-cloudformation';
import type { ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { formatJsonError, formatJsonResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const up: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (event) => {
  const accountId = event.body.accountId;
  console.log('up::accountId', accountId);

  const serverName = event.body.serverName;
  console.log('up::serverName', serverName);

  const stackName = `ezmc-${accountId}-${serverName}`;

  const client = new CloudFormationClient({ region: process.env.REGION });
  return client
    .send(
      new CreateStackCommand({
        StackName: stackName,
        TemplateURL: 's3://ezmc-cf-templates/game-server.yml',
        Tags: [
          {
            Key: 'AccountId',
            Value: accountId,
          },
          {
            Key: 'ServerName',
            Value: serverName,
          },
        ],
      }),
    )
    .then((res) => {
      console.log('Created new server', accountId, serverName);
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

export const main = middyfy(up);
