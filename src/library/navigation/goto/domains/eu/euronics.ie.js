module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    country: 'IE',
    domain: 'euronics.ie',
    store: 'euronics',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  },
};
