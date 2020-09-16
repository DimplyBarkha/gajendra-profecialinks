
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'power.fi',
    timeout: 50000,
    country: 'FI',
    store: 'power',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(60000);
    await context.goto(url, { timeout: timeout, waitUntil: 'load' });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
