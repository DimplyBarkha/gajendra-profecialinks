
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmart.ca',
    timeout: 1000000,
    country: 'CA',
    store: 'walmart',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    context.setBlockAds(false);
    context.setLoadAllResources(true);
    context.setAntiFingerprint(false);
    await context.setJavaScriptEnabled(true);

    // await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true});
    await context.goto(url, {
      firstRequestTimeout: 1000000,
      timeout,
      waitUntil: 'load',
      checkBlocked: false,
    });
  },
};
