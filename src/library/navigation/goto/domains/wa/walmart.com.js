
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmart.com',
    country: 'US',
    store: 'walmart',
    timeout: 20000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setAntiFingerprint(true); 
    await context.setUseRelayProxy(true);
    await context.goto(url, {
      firstRequestTimeout: 40000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    try{
      await context.waitForNavigation();
    }catch(err){
      console.log('No Navigation')
    }
    

    try{
      // @ts-ignore
      // eslint-disable-next-line no-undef
      await context.evaluateInFrame('iframe', () => grecaptcha.execute());        
    }catch(err){
      console.log('Captcha did not load');
    }
    
  },
};
