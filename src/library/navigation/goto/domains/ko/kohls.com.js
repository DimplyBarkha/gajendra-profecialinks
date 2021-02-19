
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'kohls.com',
    timeout: 30000,
    country: 'US',
    store: 'kohls',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto(url, {
      timeout: 30000,
      waitUntil: 'load',
      checkBlocked: false,
    });
  },
};
