
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'apteka-melissa.pl',
    country: 'PL',
    timeout: 60000,
    store: 'apteka-melissa',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setAntiFingerprint(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  }
};
