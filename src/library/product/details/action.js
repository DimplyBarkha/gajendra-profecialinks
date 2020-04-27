module.exports = {
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
  inputs: [
    {
      name: "sku",
      description: "Retailer unique SKU",
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
    debugger;
    await gotoUrl({ url }, { domain });
    await productDetails({ url }, { domain });
  }
}

