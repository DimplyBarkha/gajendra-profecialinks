
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bol.com',
    timeout: null,
    country: 'BE',
    store: 'bol',
    zipcode: '',
  },
   implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 20000;
    await context.setLoadAllResources(true);
    await context.setAntiFingerprint(false);
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, first_request_timeout: 60, load_timeout: 60 });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
