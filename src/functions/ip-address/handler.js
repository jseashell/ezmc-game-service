import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { DescribeContainerInstancesCommand, ECSClient, ListContainerInstancesCommand } from '@aws-sdk/client-ecs';
import { formatJsonError, formatJsonResponse } from '../../libs/apiGateway';
import { buildClusterArn } from '../../libs/ecs';

export const ipAddress = async (event) => {
    const clusterName = event.queryStringParams.clusterName;
    const ecsClient = new ECSClient({ region: process.env.REGION });

    return ecsClient
        .send(
            new ListContainerInstancesCommand({
                cluster: buildClusterArn(clusterName),
            }),
        )
        .then((res) => {
            if (res.containerInstanceArns?.length > 0) {
                return ecsClient
                    .send(
                        new DescribeContainerInstancesCommand({
                            cluster: buildClusterArn(clusterName),
                            containerInstances: [res.containerInstanceArns[0]],
                        }),
                    )
                    .then((res) => {
                        if (res.containerInstances?.length > 0) {
                            const instanceId = res.containerInstances[0].ec2InstanceId;
                            const ec2Client = new EC2Client({ region: process.env.REGION });
                            return ec2Client
                                .send(
                                    new DescribeInstancesCommand({
                                        filters: `Name=instance-id,Values=${instanceId}`,
                                    }),
                                )
                                .then((res) => {
                                    const ipAddress = res.Reservations?.[0].Instances?.[0].PublicIpAddress;
                                    return formatJsonResponse({
                                        ipAddress: ipAddress,
                                    });
                                })
                                .catch((err) => {
                                    console.error(err);
                                    return formatJsonError(err);
                                });
                        } else {
                            return formatJsonResponse({
                                ipAddress: '',
                            });
                        }
                    });
            } else {
                return formatJsonResponse({
                    ipAddress: '',
                });
            }
        })
        .catch((err) => {
            console.error(err);
            return formatJsonError(err);
        });
};
