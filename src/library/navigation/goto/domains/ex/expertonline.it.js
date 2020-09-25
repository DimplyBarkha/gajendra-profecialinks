
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'expertonline.it',
    timeout: 90000,
    country: 'IT',
    store: 'expert',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
