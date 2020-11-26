
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'very.co.uk',
    timeout: 20000,
    country: 'UK',
    store: 'very',
    zipcode: '',
  }, implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(100000);
    await context.goto(url,
      {
        block_ads: false,
        timeout: 100000,
        waitUntil: 'load',
        load_all_resources: true,
        images_enabled: true,
      });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
