module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'lowes.com',
    timeout: '',
    country: 'US',
    store: 'lowes',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    // await context.setAntiFingerprint(false);
    // await context.setLoadAllResources(true);
    // await context.setBlockAds(false);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
