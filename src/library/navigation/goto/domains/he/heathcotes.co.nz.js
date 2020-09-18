
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'heathcotes.co.nz',
    timeout: 50000,
    country: 'NZ',
    store: 'heathcotes',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
