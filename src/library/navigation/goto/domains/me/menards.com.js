
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'menards.com',
    timeout: 120000,
    country: 'US',
    store: 'menards',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 10000 } = parameters;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    const { url, zipcode, storeId } = inputs;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true, captureRequests: true });
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};