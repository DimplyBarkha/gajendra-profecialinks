
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carphonewarehouse.com',
    timeout: null,
    country: 'UK',
    store: 'carphonewarehouse',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  },
};
