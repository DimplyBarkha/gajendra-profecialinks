
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'payngo.co.il',
    timeout: 120000,
    country: 'IL',
    store: 'payngo',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(100000);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
