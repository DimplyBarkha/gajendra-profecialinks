
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ebay.es',
    timeout: 240000,
    country: 'ES',
    store: 'ebay',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
      await context.setLoadAllResources(true);
    }
  },
};
