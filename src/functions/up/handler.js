const execShPromise = require('exec-sh').promise;
import { formatJsonError, formatJsonResponse } from '../../libs/apiGateway';

/**
 * Deploys and spins up a new game server stack
 * @param {*} event Lambda proxy event
 * @returns Lambda proxy response
 */
export const up = async (event) => {
    try {
        const out = await execShPromise(
            `serverless deploy --config ../../config/game-server.yml --stage ${event.body.stage} --region ${event.body.region} --param="serverName=${event.body.serverName}" --param="accountId=${event.body.accountId}"`,
        );

        const clusterArn = '';

        return formatJsonResponse({
            clusterArn: clusterArn,
            out: out,
        });
    } catch (err) {
        console.error('Failed to deploy new game server', err, err.stderr);
        return formatJsonError(err);
    }
};
