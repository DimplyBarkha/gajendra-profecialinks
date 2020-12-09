
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'unieuro.it',
    timeout: 100000,
    country: 'IT',
    store: 'unieuro',
    zipcode: '',
  },
  implementation: async (
    { url },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 100000;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    const responseStatus = await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);
    try {
      // @ts-ignore
    document.querySelector('button[id=onetrust-accept-btn-handler]').click()
    await new Promise(r => setTimeout(r, 6000));
    } catch (error) {
      
    }
  }
};