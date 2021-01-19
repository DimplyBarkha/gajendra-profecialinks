
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefouruae.com',
    timeout: 90000,
    country: 'AE',
    store: 'carrefouruae',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setFirstRequestTimeout(60000);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, {
      block_ads: false,
      timeout: 90000,
      waitUntil: 'load',
      load_all_resources: true,
      images_enabled: true,
    });
  },
};
