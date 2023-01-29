const execShPromise = require('exec-sh').promise;
import { formatJsonError, formatJsonResponse } from '../../libs/apiGateway';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'; // ES Modules import

/**
 * Deploys and spins up a new game server stack
 * @param {*} event Lambda proxy event
 * @returns Lambda proxy response
 */
export const up = async (event) => {
    const client = new S3Client({ region: process.env.REGION || 'us-east-1' });
    const response = await client.send(
        new GetObjectCommand({
            bucket: process.env.ASSET_BUCKET_NAME,
            key: process.env.CF_GAME_SERVER_OBJECT_KEY,
        }),
    );

    try {
        return formatJsonResponse({
            response,
        });
    } catch (err) {
        console.error('Failed to deploy new game server', err, err.stderr);
        return formatJsonError(err);
    }
};
