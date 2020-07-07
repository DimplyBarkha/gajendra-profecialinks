
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'groceries.morrisons.com',
    timeout: null,
    country: 'UK',
    store: 'morrisons',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url, {
      first_request_timeout: 100000,
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: 'load',
      checkBlocked: true,
    });
  },
};
