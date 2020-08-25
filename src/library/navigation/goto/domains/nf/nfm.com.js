module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'nfm.com',
    timeout: 120000,
    country: 'US',
    store: 'nfm',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 60000, anti_fingerprint: true, timeout, waitUntil: 'load', checkBlocked: true });
  },
};