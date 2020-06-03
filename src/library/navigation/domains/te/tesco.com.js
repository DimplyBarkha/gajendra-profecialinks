
module.exports = {
  parameterValues: {
    domain: 'tesco.com',
    country: 'uk',
    store: 'tesco',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 100000, waitUntil: 'load', checkBlocked: true });
  },
};
