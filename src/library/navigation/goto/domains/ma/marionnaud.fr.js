
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'marionnaud.fr',
    timeout: 200000,
    country: 'FR',
    store: 'marionnaud',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 90000;
    // await setFirstRequestTimeout(firstRequestTimeout: 90000): Promise<void>
    await context.setFirstRequestTimeout(90000);
    await context.goto(url, { first_request_timeout: 90000, timeout, waitUntil: 'load', checkBlocked: true });
  },
};
