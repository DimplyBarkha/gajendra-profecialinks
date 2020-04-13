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
      name: "url",
      description: "",
      type: "string"
    }
  ],
  dependencies: {
  },
  path: "${country}/${domain}",
  implementation: async ({ url }, { country, domain }, context, dependencies) => {
    await context.goto(url, {timeout: 10000, waitUntil: 'load', checkBlocked: true});
  }
}