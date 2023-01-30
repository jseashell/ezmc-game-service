import { formatJsonError, formatJsonResponse } from '../../libs/apiGateway';
import { getGameServerTemplate } from '../../libs/s3';

/**
 * Tears down a game server stack
 * @param {*} event Lambda proxy event
 * @returns Lambda proxy response
 */
export const down = async (event) => {
    try {
        const template = getGameServerTemplate();
        return formatJsonResponse(template);
    } catch (err) {
        console.error('Failed to teardown game server', err);
        return formatJsonError(err);
    }
};
