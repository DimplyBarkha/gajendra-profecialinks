
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediaexpert.pl',
    timeout: 60000,
    zipcode: '',
    store: 'mediaexpert',
    country: 'PL',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setLoadImages(true);
    await context.setLoadAllResources(true)
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  }
};
