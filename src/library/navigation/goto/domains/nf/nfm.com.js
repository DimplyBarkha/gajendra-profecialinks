module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'nfm.com',
    timeout: 60000,
    country: 'US',
    store: 'nfm',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setFirstRequestTimeout(30000);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
