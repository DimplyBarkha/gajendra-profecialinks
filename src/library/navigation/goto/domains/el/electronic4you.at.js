
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'electronic4you.at',
    timeout: 30000,
    country: 'AT',
    store: 'electronic4you',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(60000)
    await context.goto(url, { timeout: timeout, waitUntil: 'load', "load_all_resources":true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
