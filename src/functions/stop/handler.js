import { ECSClient, UpdateServiceCommand } from '@aws-sdk/client-ecs';
import { formatJsonError, formatJsonResponse } from '../../libs/apiGateway';
import { buildClusterArn, getServiceName } from '../../libs/ecs';

/**
 * Signals the game service to stop by updating auto-scaling configuration to have zero instances.
 * @param {object} event Lambda proxy event
 * @returns {object} Lambda proxy response containing a success `message` or an error
 */
export const stop = async (event) => {
    const client = new ECSClient({ region: process.env.REGION });
    const clusterName = event.queryStringParameters.clusterName;

    const serviceName = await getServiceName();

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
