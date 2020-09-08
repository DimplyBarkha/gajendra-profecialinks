
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'worten.pt',
    timeout: null,
    country: 'PT',
    store: 'worten',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: 'load',
    });
  },
};
