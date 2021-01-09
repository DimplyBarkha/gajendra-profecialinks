

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'currys.ie',
    timeout: 30000,
    country: 'IE',
    store: 'currys',
    zipcode: 'D02TX94',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    console.log('IN GOTO');
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setFirstRequestTimeout(60000);
    await context.setUseRelayProxy(false);
    await context.setJavaScriptEnabled(true);

    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
