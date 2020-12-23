
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'shoprite.com',
    timeout: null,
    country: 'US',
    store: 'shoprite_08096',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 1000000;
    const { url, zipcode, storeId } = inputs;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
