
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    transform: null,
    domain: 'kruidvat.nl',
    zipcode: '',
  },
  // implementation: async ({ url }, parameters, context, dependencies) => {
  //   context.setBlockAds(false);
  //   context.setLoadAllResources(true);
  //   context.setAntiFingerprint(false);
  //   await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true });
  // },
};
