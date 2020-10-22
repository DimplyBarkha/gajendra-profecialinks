
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dns-shop.ru',
    timeout: null,
    country: 'RU',
    store: 'dns-shop',
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
