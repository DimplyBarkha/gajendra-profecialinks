module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'auchan.fr',
    timeout: 1000000,
    country: 'FR',
    store: 'auchan',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setCssEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setJavaScriptEnabled(true);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBypassCSP(true);
    await context.setUseRelayProxy(false);
    const lastResponseData = await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: false });
    try {
      console.log('lastResponseData.status', lastResponseData.status);
      if (lastResponseData.status === 404) {
        console.log('Blocked: ' + lastResponseData.status);
        return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
      }
    } catch (error) {
      console.log('ResponseData status is not available');
    }
  },
};
