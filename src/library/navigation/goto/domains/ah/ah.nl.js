
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ah.nl',
    timeout: 50000,
    country: 'NL',
    store: 'albertheijn',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, { timeout }, context, dependencies) => {
    timeout = timeout || 10000;
    await context.setLoadImages(true);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout,
      waitUntil: 'load',
    });
  },
};
