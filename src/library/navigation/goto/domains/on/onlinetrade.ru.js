
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'onlinetrade.ru',
    timeout: 40000,
    country: 'RU',
    store: 'onlinetrade',
    zipcode: '',
  }, implementation: async ({ url , zipcode, storeId} , parameters ,context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 40000;
    await context.captureRequests();
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
  }
};
