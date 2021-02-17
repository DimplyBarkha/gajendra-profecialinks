
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'marionnaud.fr',
    timeout: 100000,
    country: 'FR',
    store: 'marionnaud',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 90000, timeout, waitUntil: 'load', checkBlocked: true });
  },
};
