export default {
  type: 'object',
  properties: {
    accountId: { type: 'string' },
    serverName: { type: 'string' },
  },
  required: ['accountId', 'serverName'],
} as const;
