module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediaexpert.pl',
    timeout: 50000,
    country: 'PL',
    store: 'mediaexpert',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    await context.goto(inputs.url, {
      timeout: 60000,
      waitUntil: 'load',
      checkBlocked: true,
    });
  },
};
