
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bebitus.es',
    timeout: 30000,
    country: 'ES',
    store: 'bebitus',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain }, context, { productDetails }) => {
    await context.setLoadImages(true);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: 'networkidle0',
    });
  },
};
