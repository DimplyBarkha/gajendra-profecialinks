
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jumbo.ae',
    timeout: null,
    country: 'AE',
    store: 'jumbo',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false);
    const timeout = parameters.timeout ? parameters.timeout : 80000;
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
  },
};
