module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.com.br',
    timeout: 70000,
    zipcode: '',
    store: 'carrefour',
    country: 'BR',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 70000;
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
