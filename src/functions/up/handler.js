import { CloudFormationClient, CreateStackCommand } from '@aws-sdk/client-cloudformation';
import { formatJsonError, formatJsonResponse } from '../../libs/apiGateway';

/**
 * Deploys and spins up a new game server stack
 * @param {*} event Lambda proxy event
 * @returns Lambda proxy response
 */
export const up = async (event) => {
    const accountId = event.body.accountId;
    const serverName = event.body.serverName;

    const client = new CloudFormationClient({ region: process.env.REGION });

    const command = new CreateStackCommand({
        StackName: `ezmc-${accountId}-${serverName}`,
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
