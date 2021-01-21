
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'canadiantire.ca',
    timeout: 120000,
    country: 'CA',
    store: 'canadiantire',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 90000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, { first_request_timeout: 90000, timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
