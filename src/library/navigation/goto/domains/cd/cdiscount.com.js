
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'cdiscount.com',
    timeout: 120000,
    country: 'FR',
    store: 'cdiscount',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    try {
      await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    } catch (e) {
      console.log('errrror ======> ', e);
    }
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
