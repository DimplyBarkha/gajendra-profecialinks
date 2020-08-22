
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'leons.ca',
    timeout: 100000,
    country: 'CA',
    store: 'leons',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    if (zipcode) {
      await dependencies.setZipCode({ url, zipcode });
    }
  },
};
