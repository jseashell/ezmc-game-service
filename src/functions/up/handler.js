import { formatJsonError, formatJsonResponse } from '../../libs/apiGateway';
import { getGameServerTemplate } from '../../libs/s3';

/**
 * Deploys and spins up a new game server stack
 * @param {*} event Lambda proxy event
 * @returns Lambda proxy response
 */
export const up = async (event) => {
    try {
        const template = await getGameServerTemplate();
        return formatJsonResponse(template);
    } catch (err) {
        console.error('Failed to stand up new game server', err);
        return formatJsonError(err);
    }
};
