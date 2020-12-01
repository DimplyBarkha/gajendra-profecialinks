
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bueroshop24.de',
    timeout: 100000,
    country: 'DE',
    store: 'bueroshop24',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 1000000;
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
