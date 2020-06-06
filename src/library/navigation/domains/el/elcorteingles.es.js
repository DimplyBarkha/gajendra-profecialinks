
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'elcorteingles.es',
    store: 'elcorteingles',
    country: 'ES',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 100000, waitUntil: 'load', checkBlocked: true });
  },
};
