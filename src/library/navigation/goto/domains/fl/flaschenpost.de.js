
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'flaschenpost.de',
    timeout: 50000,
    country: 'DE',
    store: 'flaschenpost',
    zipcode: '28203',
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