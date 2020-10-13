
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'betta.com.au',
    timeout: 500000,
    country: 'AU',
    store: 'betta',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  },
};
