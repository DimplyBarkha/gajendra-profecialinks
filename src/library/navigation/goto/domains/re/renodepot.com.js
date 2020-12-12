module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    country: 'CA',
    domain: 'renodepot.com',
    store: 'reno-depot',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false);
    await context.goto(`${url}`, {
      timeout: timeout,
      anti_fingerprint: true,
      discard_CSP_header: false,
    });
  },
};
