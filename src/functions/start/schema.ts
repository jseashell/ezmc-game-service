export default {
  type: 'object',
  properties: {
    clusterName: { type: 'string' },
  },
  required: ['clusterName'],
} as const;
