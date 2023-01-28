import { DescribeServicesCommand, ECSClient, ListServicesCommand } from '@aws-sdk/client-ecs';

/**
 * Gets the arn of the firstservice for the given cluster
 * @param {string} clusterName
 * @returns {string} service arn
 */
export const getServiceArn = async (clusterName) => {
    const client = new ECSClient({ region: process.env.REGION });
    return client
        .send(
            new ListServicesCommand({
                cluster: buildClusterArn(clusterName),
            }),
        )
        .then((res) => {
            return res.serviceArns?.[0] || null;
        });
};

/**
 * Gets the name of the first occurence of a service for the given cluster
 * @param {string} clusterName
 * @returns {string} service name
 */
export const getServiceName = async (clusterName) => {
    const client = new ECSClient({ region: process.env.REGION });
    return getServiceArn().then(async (serviceArn) => {
        return client
            .send(
                new DescribeServicesCommand({
                    cluster: buildClusterArn(clusterName),
                    services: [serviceArn],
                }),
            )
            .then((res) => {
                return res.services?.[0].serviceName || null;
            });
    });
};

/**
 * @param {string} clusterName
 * @returns {string} arn for this region/account for the given cluster
 */
export const buildClusterArn = (clusterName) => {
    return `arn:aws:ecs:${process.env.REGION}:${process.env.AWS_ACCOUNT_ID}:cluster/${clusterName}`;
};
