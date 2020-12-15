
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'cvs.com',
    country: 'US',
    store: 'cvs',
    timeout: 60000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
