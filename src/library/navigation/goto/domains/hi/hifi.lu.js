
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'hifi.lu',
    timeout: 30000,
    country: 'LU',
    store: 'hifi',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, first_request_timeout: 60, load_timeout: 60 });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
