
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'holmesproducts.com',
    timeout: null,
    country: 'US',
    store: 'holmesproducts',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    console.log('IN GOTO');
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setFirstRequestTimeout(60000);
    await context.setUseRelayProxy(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  },
};
