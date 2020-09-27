
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmart.com',
    country: 'US',
    store: 'walmart',
    timeout: 20000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 20000;
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
