module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fust.ch',
    timeout: null,
    country: 'CH',
    store: 'fust',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url, {
      timeout: 250000,
      waitUntil: 'load',
      checkBlocked: true,
    });
  },
};
