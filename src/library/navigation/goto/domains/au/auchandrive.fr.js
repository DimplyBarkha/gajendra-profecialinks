
module.exports = {
  parameterValues: {
    domain: 'auchandrive.fr',
    country: 'FR',
    store: 'auchandrive',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 100000, waitUntil: 'load', checkBlocked: true });
  },
};
