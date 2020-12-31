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
    {
      name: 'zipcode',
      description: 'Set location ',
      type: 'string',
    },
    {
      name: 'storeId',
      description: 'storeId for product',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    setZipCode: 'action:navigation/goto/setZipCode',
  },
  path: './goto/domains/${domain[0:2]}/${domain}',
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const { url, zipcode, storeId } = inputs;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
