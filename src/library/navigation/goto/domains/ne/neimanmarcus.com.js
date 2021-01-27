
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'neimanmarcus.com',
    timeout: 20000,
    zipcode: '',
    country: 'US',
    store: 'neimanmarcus',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;

    await context.setJavaScriptEnabled(true);

    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
  },
};
