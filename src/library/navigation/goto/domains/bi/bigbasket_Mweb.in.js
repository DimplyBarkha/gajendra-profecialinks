module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bigbasket_Mweb.in',
    timeout: null,
    country: 'IN',
    store: 'Bigbasket_Mweb',
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
