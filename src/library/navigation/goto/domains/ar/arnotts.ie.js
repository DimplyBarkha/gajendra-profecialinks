
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'arnotts.ie',
    timeout: null,
    country: 'IE',
    store: 'arnotts',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 60000, anti_fingerprint: true, timeout, waitUntil: 'load', checkBlocked: true });
  },
};
