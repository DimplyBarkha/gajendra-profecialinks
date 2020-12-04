
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ab.gr',
    timeout: 50000,
    country: 'GR',
    store: 'ab',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false);
  },
};
