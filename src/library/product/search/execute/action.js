module.exports = {
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
      name: 'keywords',
      description: 'keywords to search for',
      type: 'string',
    },
  ],
  dependencies: {
    goto: 'action:navigation/goto/domains/${domain[0:2]}/${domain}',
  },
  path: 'stores/${store[0:1]}/${store}/${country}',
  implementation: async ({ keywords }, { country, store }, context, dependencies) => {
    throw new Error('No default implementation');
  },
};
