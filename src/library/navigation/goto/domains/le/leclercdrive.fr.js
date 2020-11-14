
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'leclercdrive.fr',
    timeout: 60000,
    country: 'FR',
    store: 'leclerc',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.captureRequests();
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
        type: 'IMAGECAPTCHA',
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 70000));
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);
    let captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title]), span.recaptcha-anchor";
    try {
      await context.waitForSelector(captchaFrame);
    } catch (error) {
      console.log('error: without underscore ', error);
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
      //await context.evaluateInFrame('iframe', () => grecaptcha.execute());
      await context.solveCaptcha({ type: 'RECAPTCHA', inputElement: '.recaptcha-anchor' });
      console.log('solved captcha, waiting for page change');
      await context.waitForNavigation(timeout);
    }
   
  },
};
