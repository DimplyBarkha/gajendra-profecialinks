
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'avansas.com',
    timeout: 60000,
    country: 'TR',
    store: 'avansas',
    zipcode: "''",
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    await context.setFirstRequestTimeout(60000);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    },
};
