
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dm.de',
    country: 'DE',
    store: 'dm',
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
