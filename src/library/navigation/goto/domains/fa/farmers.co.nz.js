
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'farmers.co.nz',
    timeout: null,
    country: 'NZ',
    store: 'farmers',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setAntiFingerprint(false);
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
  },
};
