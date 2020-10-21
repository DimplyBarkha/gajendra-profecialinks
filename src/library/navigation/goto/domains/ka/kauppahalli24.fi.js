
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'kauppahalli24.fi',
    timeout: '50000',
    country: 'FI',
    store: 'kauppahalli24',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
