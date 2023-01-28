const execShPromise = require('exec-sh').promise;
import { formatJsonError, formatJsonResponse } from '../../lib/apiGateway';

/**
 * Tears down a game server stack
 * @param {*} event Lambda proxy event
 * @returns Lambda proxy response
 */
export const down = async (event) => {
  try {
    const out = await execShPromise(
      `serverless remove --config ../../config/game-server.yml --stage ${event.body.stage} --region ${event.body.region}`,
      {
        env: {
          serverName: event.body.serverName,
          accountId: event.body.accountId,
          region: event.body.region,
          stage: event.body.stage,
        },
      },
    );
    return formatJsonResponse(out);
  } catch (err) {
    console.error('Failed to teardown game server', env, err, err.stderr);
    return formatJsonError(err);
  }
};
