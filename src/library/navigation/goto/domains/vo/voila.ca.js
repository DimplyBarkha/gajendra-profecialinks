
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'voila.ca',
    timeout: 50000,
    country: 'CA',
    store: 'voila',
    zipcode: '',
  },

  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
