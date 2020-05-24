module.exports = {
  parameters: [
    {
      name: 'domain',
      description: 'The top private domain of the website (e.g. amazon.com)',
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
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
