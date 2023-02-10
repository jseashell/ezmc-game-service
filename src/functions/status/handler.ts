import { DescribeTasksCommand, ECSClient, ListTasksCommand } from '@aws-sdk/client-ecs';
import { formatJsonError, formatJsonResponse } from '@libs/api-gateway';
import { buildClusterArn, getServiceArn } from '@libs/ecs';
import { middyfy } from '@libs/lambda';
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

const status: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  const clusterName = event.queryStringParameters.clusterName;
  const serviceArn = await getServiceArn(clusterName);

  const client = new ECSClient({ region: process.env.REGION });
  return client
    .send(
      new ListTasksCommand({
        cluster: buildClusterArn(clusterName),
        serviceName: serviceArn,
      }),
    )
    .then((res) => {
      if (res.taskArns?.length > 0) {
        return res.taskArns[0];
      } else {
        return Promise.reject(`No tasks for service "${serviceArn}" in cluster "${clusterName}"`);
      }
    })
    .then((taskArn) => {
      return client.send(
        new DescribeTasksCommand({
          cluster: buildClusterArn(clusterName),
          tasks: [taskArn],
        }),
      );
    })
    .then((res) => {
      if (res.tasks?.length > 0 && res.tasks[0].containers?.length > 0) {
        return formatJsonResponse({
          status: res.tasks[0].containers[0].lastStatus,
        });
      } else {
        return formatJsonResponse({
          status: 'LAUNCHING',
        });
      }
    })
    .catch((err) => {
      console.error(err);
      return formatJsonError(err);
    });
};

export const main = middyfy(status);
