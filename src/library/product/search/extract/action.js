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
  ],
  inputs: [
  ],
  dependencies: {
    productDetails: 'extraction:product/search/extract/stores/${store[0:1]}/${store}/${country}',
  },
  path: 'stores/${store[0:1]}/${store}/${country}',
  implementation: async (inputs, parameters, context, { productDetails }) => {
    return await context.extract(productDetails);
  },
};
