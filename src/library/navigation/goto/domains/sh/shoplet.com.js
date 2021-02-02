
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'shoplet.com',
    timeout: 100000,
    country: 'US',
    store: 'shoplet',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.setBypassCSP(true);
    await context.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36");
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const resp=await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false,firstRequestTimeout:60000,antiCaptchaOptions:{type: 'RECAPTCHA'} });
    console.log('response at goto:',resp);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    if(resp.status==200){
      const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title]), div.g-recaptcha";
      try {
        await context.waitForSelector(captchaFrame);
      } catch (error) {
        console.log('error: without undescore ', error);
      } 
      if (isCaptchaFramePresent) {
        console.log('isCaptcha', true);
        await context.waitForNavigation({ timeout });
        // @ts-ignore
        // eslint-disable-next-line no-undef
        try {
          await context.evaluateInFrame('iframe', () => grecaptcha.execute());
          await new Promise((resolve) => setTimeout(resolve, 8000));
        } catch(err) {
          console.log('got some error - ', err.message);
          console.log('retrying!!');
          try {
            await context.evaluateInFrame('iframe', () => grecaptcha.execute());
            await new Promise((resolve) => setTimeout(resolve, 8000));
          } catch(err) {
            console.log('re-tried that - still error - ', err.message);
            throw Error ('grecaptcha is not working!!');
          }
        }
        console.log('solved captcha, waiting for page change');
        await context.waitForNavigation({ timeout });
      }
    }
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  }
};
