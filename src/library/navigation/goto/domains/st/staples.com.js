
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'staples.com',
    timeout: 200000,
    country: 'US',
    store: 'staples',
    zipcode: '',
  },
  // implementation: async ({ url }, parameters, context, dependencies) => {
  //   await context.goto(url, {
  //     block_ads: false,
  //     load_all_resources: true,
  //     images_enabled: true,
  //     timeout: 50000,
  //     waitUntil: 'load',
  //   });
  //   await context.waitForNavigation();
  // },
};
