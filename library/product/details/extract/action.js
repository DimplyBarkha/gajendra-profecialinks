module.exports = {
  parameters: [
    {
      name: "country",
      description: ""
    },
    {
      name: "domain",
      description: ""
    }
  ],
  inputs: [],
  dependencies: {
    productDetails: 'extraction:product/details/extract/${country}/${domain}',
  },
  path: "${country}/${domain}",
  implementation: async ({ sku }, { country, domain }, context, {productDetails}) => {
    await context.extract(productDetails);
  }
}