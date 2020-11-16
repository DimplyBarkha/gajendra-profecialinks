
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'marionnaud.at',
    timeout: 50000,
    country: 'AT',
    store: 'marionnaud',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(50000);
    await context.goto(url,
      {
        first_request_timeout: 50000,
        block_ads: false,
        timeout: 50000,
        waitUntil: 'load',
        load_all_resources: true,
        images_enabled: true,
        checkBlocked: true,
      });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
