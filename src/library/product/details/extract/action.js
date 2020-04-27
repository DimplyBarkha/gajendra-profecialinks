module.exports = {
  description: 'Extract the product details when on a product details page already',
  parameters: [
    {
      name: "country",
      description: "ISO-2 country code"
    },
    {
      name: "domain",
      description: "Top private domain"
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

