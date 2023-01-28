const execShPromise = require('exec-sh').promise;
import { formatJsonError, formatJsonResponse } from '../../libs/apiGateway';

/**
 * Tears down a game server stack
 * @param {*} event Lambda proxy event
 * @returns Lambda proxy response
 */
export const down = async (event) => {
    try {
        const out = await execShPromise(
            `serverless remove --config ../../config/game-server.yml --stage ${event.body.stage} --region ${event.body.region} --param="serverName=${event.body.serverName}" --param="accountId=${event.body.accountId}"`,
        );
        return formatJsonResponse(out);
    } catch (err) {
        console.error('Failed to teardown game server', err, err.stderr);
        return formatJsonError(err);
    }
};
