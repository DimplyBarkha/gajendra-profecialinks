module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    country: 'US',
    domain: 'target.com',
    store: 'target',
    timeout: 60000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    /*  await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false); */
    await context.setUseRelayProxy(false);
    await context.setJavaScriptEnabled(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
