
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'samsclub.com',
    country: 'US',
    timeout: 40000,
    store: 'samsclub',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.captureRequests();
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false);
    try {
      await context.goto(url, {
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: true,
        block_ads: false,
        load_all_resources: true,
        images_enabled: true,
        load_timeout: 0,
      });
    } catch (e) {
      console.log('page load time out ----> ', e);
    }
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
