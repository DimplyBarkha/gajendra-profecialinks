module.exports = {
  parameters: [
    {
      name: 'domain',
      description: 'The top private domain of the website (e.g. amazon.com)',
    },
    {
      name: 'timeout',
      description: 'Timeout for loading',
      type: 'number',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'url',
      description: 'The URL to go to',
      type: 'string',
    },
  ],
  dependencies: {
  },
  path: './domains/${domain[0:2]}/${domain}',
  implementation: async ({ url }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  },
};
