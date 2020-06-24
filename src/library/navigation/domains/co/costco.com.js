
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'costco.com',
    timeout: null,
    country: 'US',
    store: 'costco',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url, {
      first_request_timeout: 50000,
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 30000,
      waitUntil: 'load',
      checkBlocked: true,
    });
  },
};
