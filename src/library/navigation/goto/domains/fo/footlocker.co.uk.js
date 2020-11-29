module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'footlocker.co.uk',
    timeout: 90000,
    country: 'UK',
    store: 'footlocker',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 50000,
      waitUntil: 'load',
    });
    await context.waitForNavigation();
  },
};
