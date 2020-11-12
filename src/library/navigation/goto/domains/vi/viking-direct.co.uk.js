
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'viking-direct.co.uk',
    timeout: 60000,
    country: 'UK',
    store: 'viking',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setAntiFingerprint(false);
    await context.goto(url,
      {
        first_request_timeout: 60000,
        block_ads: false,
        timeout: 60000,
        waitUntil: 'load',
        load_all_resources: true,
        images_enabled: true,
        checkBlocked: true,
      });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
