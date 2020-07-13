
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'amazon.it',
    timeout: null,
    country: 'IT',
    store: 'amazon',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { block_ads: false, timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
