
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bhphotovideo.com',
    timeout: 50000,
    country: 'US',
    store: 'bhphotovideo',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(70000);
    await context.goto(url,
      {
        block_ads: false,
        timeout: 70000,
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
