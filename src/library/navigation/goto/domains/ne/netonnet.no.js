
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'netonnet.no',
    timeout: 20000,
    country: 'NO',
    store: 'netonnet',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies,
    ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    
    await context.goto(url, {
    timeout: timeout,
    waitUntil: 'load',
    checkBlocked: true,
    });
    },
};
