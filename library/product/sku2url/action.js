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
  },
  path: "${country}/${domain}",
  implementation: async ({ sku }, { country, domain }, context, dependencies) => {
    throw new Error('No default implementation');
  }
}