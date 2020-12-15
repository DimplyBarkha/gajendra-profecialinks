module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'easyparapharmacie.com',
    timeout: 30000,
    country: 'FR',
    store: 'easyparapharmacie',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  },
};
