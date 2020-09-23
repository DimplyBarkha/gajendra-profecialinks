
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dyson.ae',
    timeout: 40000,
    country: 'AE',
    store: 'dyson',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 40000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, captureRequests: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
