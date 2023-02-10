import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: 'status',
        method: 'get',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              clusterName: true,
            },
          },
        },
      },
    },
  ],
};
