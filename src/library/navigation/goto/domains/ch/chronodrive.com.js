
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'chronodrive.com',
    timeout: null,
    country: 'FR',
    store: 'Chronodrive',
    zipcode: '91160',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    if (zipcode) {
      await dependencies.setZipCode({ url, zipcode });
    }
  },
};
