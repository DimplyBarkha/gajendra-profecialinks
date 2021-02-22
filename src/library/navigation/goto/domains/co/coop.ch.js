
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'coop.ch',
    timeout: 50000,
    country: 'CH',
    store: 'coopathome',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    
  },
};
