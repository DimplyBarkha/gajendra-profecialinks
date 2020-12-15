
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bigbasket.com',
    timeout: null,
    country: 'IN',
    store: 'bigbasket',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const { url, zipcode, storeId } = inputs;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  }
};
