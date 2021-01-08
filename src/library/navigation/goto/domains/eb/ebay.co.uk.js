module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ebay.co.uk',
    timeout: 60000,
    country: 'UK',
    store: 'ebay',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 100000;
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    await context.setFirstRequestTimeout(60000);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  },
};
