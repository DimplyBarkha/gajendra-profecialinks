
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ralphs.com',
    timeout: 80000,
    country: 'US',
    store: 'ralphs_92201',
    zipcode: '92201',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url, zipcode });
    }
  },
};
