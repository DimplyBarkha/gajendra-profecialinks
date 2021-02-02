
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'kruidvat.nl',
    timeout: 10000,
    country: 'NL',
    store: 'kruidvat',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    context.setBlockAds(false);
    context.setLoadAllResources(true);
    context.setAntiFingerprint(false);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true });
  },
};
