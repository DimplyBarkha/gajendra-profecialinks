
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'apteka-melissa.pl',
    timeout: 50000,
    store: 'apteka-melissa',
    country: 'PL',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
  },
};
