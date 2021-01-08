
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ulta.com',
    timeout: 80000,
    country: 'US',
    store: 'ulta',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 90000;
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, cookies: [] });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
