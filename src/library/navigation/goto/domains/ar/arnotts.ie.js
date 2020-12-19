
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'arnotts.ie',
    timeout: null,
    country: 'IE',
    store: 'arnotts',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setAntiFingerprint(false);
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    const response = await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    if(Math.abs(response.status / 100) === 4){
      await context.reportBlock('Blocked: ', response.status);
    }
  },
};
