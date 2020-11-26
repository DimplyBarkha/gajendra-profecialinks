module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'petsmart.ca',
    timeout: 100000,
    country: 'CA',
    store: 'petsmart',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
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
