
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fnac.com',
    timeout: 60000,
    country: 'FR',
    store: 'fnac',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
