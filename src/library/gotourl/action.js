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
      name: "url",
      description: "URL to visit",
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

