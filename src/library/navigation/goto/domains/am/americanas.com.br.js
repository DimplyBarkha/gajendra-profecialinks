
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'americanas.com.br',
    timeout: 60000,
    country: 'BR',
    store: 'americanas',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setAntiFingerprint(false);
    await context.setLoadImages(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode });
    }
  },
};
