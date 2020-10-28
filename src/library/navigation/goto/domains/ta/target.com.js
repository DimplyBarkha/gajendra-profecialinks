
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    country: 'US',
    domain: 'target.com',
    store: 'target',
    timeout: 80000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 80000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, block_ads: false, first_request_timeout: 60, load_timeout: 60, load_all_resources: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
