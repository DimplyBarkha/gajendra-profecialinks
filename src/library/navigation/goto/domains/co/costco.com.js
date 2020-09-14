
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'costco.com',
    timeout: 20000,
    country: 'US',
    store: 'costco',
    zipcode: '98188',
  },
  implementation: async ({ url, storeId }, { timeout, zipcode }, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);

    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout,
      waitUntil: 'load',
    });

    if (zipcode) {
      console.log('FOUND ZIP CODE', zipcode);
      await dependencies.setZipCode({ url, zipcode, storeId });
    }

    await context.waitForNavigation();
  },
};
