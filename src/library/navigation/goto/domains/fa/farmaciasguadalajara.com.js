module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'farmaciasguadalajara.com',
    timeout: null,
    country: 'MX',
    store: 'farmaciasguadalajara',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  },
};
