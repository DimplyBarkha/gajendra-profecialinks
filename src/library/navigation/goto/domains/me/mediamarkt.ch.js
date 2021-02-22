
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediamarkt.ch',
    timeout: 10000000,
    country: 'CH',
    store: 'mediamarkt_ch_de', // also valid for mediamarkt_ch_fr
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 1000000;
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, load_all_resources: true, images_enabled: true });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
