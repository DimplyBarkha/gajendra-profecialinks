
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    domain: 'cvs.com',
  },
  parameters: [
    {
      name: 'country',
      description: '2 letter ISO code for the country',
    },
    {
      name: 'store',
      description: 'store name',
    },
    {
      name: 'domain',
      description: 'top private domain (e.g. amazon.com)',
    },
  ],
  inputs: [
    {
      name: 'url',
      description: 'url of product',
      type: 'string',
      optional: true,
    },
    {
      name: 'id',
      description: 'unique identifier for product',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    goto: 'action:navigation/goto',
    createUrl: 'action:product/details/createUrl',
  },
  path: './stores/${store[0:1]}/${store}/${country}/execute',
  implementation: async (inputs, parameters, context, dependencies) => {
    let { url, id } = inputs;
    if (!url) {
      if (!id) {
        throw new Error('no id provided');
      }
      url = await dependencies.createUrl({ id });
    }

    // TODO: Check for not found?
    await dependencies.goto({ url, timeout: 50000 });
  },

};
