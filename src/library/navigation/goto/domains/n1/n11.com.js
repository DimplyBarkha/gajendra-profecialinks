
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'n11.com',
    timeout: 50000,
    country: 'TR',
    store: 'n11',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);

    await context.goto(url, { timeout, waitUntil: 'networkidle0', checkBlocked: true, embed_iframes: true });
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
