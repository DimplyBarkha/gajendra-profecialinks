
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'medimax.de',
    timeout: 120000,
    country: 'DE',
    store: 'medimax',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 100000;
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(100000);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    // await context.goto(url,
    //   {
    //     timeout: 150000,
    //     waitUntil: 'networkidle0',
    //   });
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
