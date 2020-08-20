
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'joycemayne.com.au',
    timeout: 50000,
    country: 'AU',
    store: 'joycemayne',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
