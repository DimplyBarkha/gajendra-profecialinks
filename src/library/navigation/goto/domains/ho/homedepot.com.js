
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'homedepot.com',
    timeout: 50000,
    country: 'US',
    store: 'homedepot',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url, {
      first_request_timeout: 50000,
      timeout: 50000,
      waitUntil: 'load',
      checkBlocked: true,
    });
  },
};
