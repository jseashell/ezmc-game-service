import { DescribeInstancesCommand, DescribeInstancesResult, EC2Client } from '@aws-sdk/client-ec2';
import {
  ContainerInstance,
  DescribeContainerInstancesCommand,
  DescribeContainerInstancesResponse,
  ECSClient,
  ListContainerInstancesCommand,
  ListContainerInstancesResponse,
} from '@aws-sdk/client-ecs';
import { formatJsonError, formatJsonResponse } from '@libs/api-gateway';
import { buildClusterArn } from '@libs/ecs';
import { middyfy } from '@libs/lambda';
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

const ipAddress: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  const clusterName = event.queryStringParameters.clusterName;
  const ecsClient = new ECSClient({ region: process.env.REGION });
  return ecsClient
    .send(
      new ListContainerInstancesCommand({
        cluster: buildClusterArn(clusterName),
      }),
    )
    .then((res: ListContainerInstancesResponse) => {
      if (res.containerInstanceArns?.length > 0) {
        return res.containerInstanceArns[0];
      } else {
        return Promise.reject(`No container instances in cluster "${clusterName}"`);
      }
    })
    .then((containerInstanceArn: string) => {
      return ecsClient.send(
        new DescribeContainerInstancesCommand({
          cluster: buildClusterArn(clusterName),
          containerInstances: [containerInstanceArn],
        }),
      );
    })
    .then((res: DescribeContainerInstancesResponse) => {
      if (res.containerInstances?.length > 0) {
        return res.containerInstances[0];
      } else {
        return Promise.reject('Unable to describe a container instance');
      }
    })
    .then((containerInstance: ContainerInstance) => {
      const instanceId = containerInstance.ec2InstanceId;
      const ec2Client = new EC2Client({ region: process.env.REGION });
      return ec2Client.send(
        new DescribeInstancesCommand({
          Filters: [
            {
              Name: 'instance-id',
              Values: [instanceId],
            },
          ],
        }),
      );
    })
    .then((res: DescribeInstancesResult) => {
      return res.Reservations?.[0].Instances?.[0].PublicIpAddress;
    })
    .then((ipAddress) => {
      return formatJsonResponse({
        ipAddress: ipAddress,
      });
    })
    .catch((err) => {
      console.error(err);
      return formatJsonError(err);
    });
};

export const main = middyfy(ipAddress);
