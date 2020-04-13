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
  inputs: [
    {
      name: "sku",
      description: "",
      type: "string"
    }
  ],
  dependencies: {
    skuToUrl: 'action:product/sku2url/${country}/${domain}',
    gotoUrl: 'action:gotourl/${country}/${domain}',
    productDetails: 'action:product/details/extract/${country}/${domain}',
  },
  path: "${country}/${domain}",
  implementation: async ({ sku }, { country, domain }, context, { skuToUrl, gotoUrl, productDetails}) => {
    const url = await skuToUrl({sku}, { country, domain });
    await gotoUrl({ url }, { domain });
    await productDetails({ url }, { domain });
  }
}