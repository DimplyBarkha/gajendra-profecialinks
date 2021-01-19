

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'newegg.com',
    timeout: 45000,
    country: 'US',
    store: 'newegg',
    zipcode: '',
  },
  implementation: async (
    { url },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    const responseStatus = await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: 30000,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    
    console.log('status : ', responseStatus.status);
    console.log('URL : ', responseStatus.url);
  },
};
