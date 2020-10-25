
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'intermarche.com',
    timeout: 60000,
    country: 'FR',
    store: 'intermarche',
    zipcode: '31130',
  },

  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.captureRequests();
    await context.setBlockAds(false);
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};

