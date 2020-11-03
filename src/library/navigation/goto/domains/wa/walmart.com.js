
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmart.com',
    country: 'US',
    store: 'walmart',
    timeout: 60000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false); 
    await context.setJavaScriptEnabled(true); 
    await context.setAntiFingerprint(false); 
    await context.setUseRelayProxy(false);
   
    await context.goto(url, {
      firstRequestTimeout: 40000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    const captchaFrame = 'div.g-recaptcha iframe';
    try {
      await context.waitForSelector(captchaFrame);
      await context.waitForSelector("#recaptcha-token");
    } catch (error) {
      console.log('Captcha Selector error ', error);
    }

    console.log('captchaFrame', captchaFrame);
    const hasCaptcha = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const isCaptchaFramePresent = await hasCaptcha(captchaFrame);

    if (isCaptchaFramePresent) {
      console.log('isCaptcha', true);
      await context.waitForNavigation(timeout);
      // @ts-ignore
      // eslint-disable-next-line no-undef
      const isCaptchaPresent = await hasCaptcha('#recaptcha-token');
      if(isCaptchaPresent) {
        await context.solveCaptcha({ type: 'RECAPTCHA', inputElement: '.g-recaptcha' });
        console.log('solved captcha, waiting for page change');
      }
      
      await context.waitForNavigation(timeout);
    }
  },
};
