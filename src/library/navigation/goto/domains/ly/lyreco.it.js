module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'lyreco.it',
    timeout: 60000,
    country: 'IT',
    store: 'lyreco',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  },
};
