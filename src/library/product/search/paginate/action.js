module.exports = {
  parameters: [
    {
      name: 'country',
      description: '2 letter ISO code for the country'
    },
    {
      name: 'store',
      description: 'store name'
    },
    {
      name: 'nextLinkSelector',
      description: 'CSS selector for the next link'
    }
  ],
  inputs: [
  ],
  path: 'stores/${store[0:1]}/${store}/${country}',
  dependencies: {
    pager: 'action:product/search/paginate/pager'
  },
  implementation: async (inputs, { nextLinkSelector }, context, { pager }) => {
    return await pager({ nextLinkSelector });
  }
};
