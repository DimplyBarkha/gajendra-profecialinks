
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'groceries.asda.com',
    country: 'UK',
    store: 'asda',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    const url = `https://groceries.asda.com/search/${inputs.RPC}`;
    const zipcode = inputs.Postcode;
    const storeId = inputs.StoreID;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  }
};
