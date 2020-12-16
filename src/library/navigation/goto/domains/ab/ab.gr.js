
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ab.gr',
    timeout: 60000,
    zipcode: '',
    store: 'ab',
    country: 'GR',
  },
   implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    console.log('IN GOTO');
    const timeout = parameters.timeout ? parameters.timeout : 120000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setFirstRequestTimeout(60000);
    await context.setUseRelayProxy(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  },
};
