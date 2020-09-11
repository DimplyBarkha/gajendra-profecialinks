module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'wallashops.co.il',
    timeout: 80000,
    country: 'IL',
    store: 'wallashops',
    zipcode: '',
  },

  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, {
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
    });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
