
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ek-onlineshop.at',
    timeout: 5000000,
    country: 'AT',
    store: 'ek-onlineshop',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  },
};
