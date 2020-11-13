
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boulanger.com',
    timeout: null,
    country: 'FR',
    store: 'boulanger',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(60000);
    await context.goto(url,
      {
        block_ads: false,
        timeout: 60000,
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
