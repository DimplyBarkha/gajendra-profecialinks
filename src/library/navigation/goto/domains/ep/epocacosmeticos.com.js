
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'epocacosmeticos.com',
    timeout: 100000,
    country: 'BR',
    store: 'epocacosmeticos',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setAntiFingerprint(false);
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    await context.setJavaScriptEnabled(true);
    const timeout = parameters.timeout ? parameters.timeout : 100000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
  },
};
