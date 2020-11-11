module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'lowes.com',
    timeout: 40000,
    country: 'DK',
    store: 'lowes',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 40000, timeout, waitUntil: 'load', checkBlocked: true });
  },
};
