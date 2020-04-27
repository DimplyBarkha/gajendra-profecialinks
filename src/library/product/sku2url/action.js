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
  },
  path: "${country}/${domain}",
  implementation: async ({ sku }, { country, domain }, context, dependencies) => {
    throw new Error('No default implementation');
  }
}

