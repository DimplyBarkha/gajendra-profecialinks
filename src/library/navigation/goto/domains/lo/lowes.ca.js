
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'lowes.ca',
    timeout: '50000',
    country: 'CA',
    store: 'lowes',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const { url, zipcode, storeId } = inputs;
    await context.goto(url, { first_request_timeout: 60000, timeout: timeout, waitUntil: 'load', checkBlocked: true, actionTimeout: 10000 });
    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
