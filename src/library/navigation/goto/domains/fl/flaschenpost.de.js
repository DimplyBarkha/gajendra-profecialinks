
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'flaschenpost.de',
    timeout: 50000,
    country: 'DE',
    store: 'flaschenpost',
    zipcode: '28203',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 10000 } = parameters;
const { url, zipcode, storeId } = inputs;
await new Promise((resolve) => setTimeout(resolve, 5000));
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    
    const responseStatus = await context.goto(url, {      
      firstRequestTimeout: 10000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);   
  }
};