
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fnac.es',
    timeout: 60000,
    country: 'ES',
    store: 'fnac',
    zipcode: '',
  },implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const maxRetries = 3;
    let numberOfCaptchas = 0;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);

    await context.goto(url, {
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
    });
  },
};
