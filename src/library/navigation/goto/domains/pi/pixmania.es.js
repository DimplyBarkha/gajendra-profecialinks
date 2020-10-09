
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'pixmania.es',
    timeout: 100000,
    country: 'ES',
    store: 'pixmania',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 100000;
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(false);
    await context.goto(url, {
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
      cssEnabled: true,
      discardCSPHeader: true,
      embedIframes: true,
      imagesEnabled: true,
      loadAllResources: true,
      force200: true,
      blockAds: false,
      jsEnabled: true,
    });
  },
};
