
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'galaxus.ch',
    timeout: null,
    country: 'CH',
    store: 'galaxus',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    // await context.setBlockAds(false);
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 60000, forced200: true, timeout, waitUntil: 'load', checkBlocked: false });
  },
};
