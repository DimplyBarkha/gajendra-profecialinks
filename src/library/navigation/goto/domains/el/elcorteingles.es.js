
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'elcorteingles.es',
    store: 'elcorteingles',
    country: 'ES',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    console.log('IN GOTO');
    const timeout = parameters.timeout ? parameters.timeout : 500000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setFirstRequestTimeout(60000);

    const lastResponseData = await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });

    if (lastResponseData.status === 500) {
      throw Error('Bad response code: ' + lastResponseData.status);
    }

    if (lastResponseData.status === 403) {
      return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
    }
  },
};
