
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'very.co.uk',
    timeout: 20000,
    country: 'UK',
    store: 'very',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(100000);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto(url,
      {
        timeout: 150000,
        waitUntil: 'networkidle0',
      });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
