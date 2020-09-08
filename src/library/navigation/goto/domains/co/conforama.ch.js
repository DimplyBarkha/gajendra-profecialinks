
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'conforama.ch',
    timeout: 90000,
    country: 'CH',
    store: 'conforama',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 90000,
      waitUntil: 'networkidle0',
    });
    await context.waitForNavigation();
  },
};
