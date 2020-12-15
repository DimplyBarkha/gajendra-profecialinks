
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ek-onlineshop.at',
    timeout: 120000,
    country: 'AT',
    store: 'ek-onlineshop',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    //const timeout = parameters.timeout ? parameters.timeout : 10000;

    //await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    //await context.setFirstRequestTimeout(60000);
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  },
};
