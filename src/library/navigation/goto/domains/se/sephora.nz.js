
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'sephora.nz',
    timeout: 30000,
    country: 'NZ',
    store: 'sephora',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.captureRequests();
    await context.goto(url, { firstRequestTimeout: 90000, timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);

    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
