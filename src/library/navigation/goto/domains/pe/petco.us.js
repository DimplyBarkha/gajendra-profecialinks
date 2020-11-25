
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'petco.us',
    timeout: 50000,
    country: 'US',
    store: 'petco',
    zipcode: '',
  },

  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false);
    try {
      await context.goto(url, {
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: true,
      });
    } catch (e) {
      console.log('page load time out ----> ', e);
    }
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
