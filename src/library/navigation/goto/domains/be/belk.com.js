
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'belk.com',
    timeout: 80000,
    country: 'US',
    store: 'belk',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(80000);
    await context.goto(url,
      {
        block_ads: false,
        timeout: 80000,
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