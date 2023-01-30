import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

/**
 * @returns the Cloudformation template for the minecraft game server
 */
export const getGameServerTemplate = async () => {
    const client = new S3Client({ region: process.env.REGION || 'us-east-1' });
    return await client.send(
        new GetObjectCommand({
            Bucket: 'ezmc-cf-templates',
            Key: 'game-server.yml',
        }),
    );
};
