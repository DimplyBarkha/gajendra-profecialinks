module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'intermarche.com',
    timeout: 120000,
    zipcode: '',
    store: 'Intermarche',
    country: 'FR',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 120000;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.setFirstRequestTimeout(100000);
    await context.goto(url, {
      firstRequestTimeout: 100000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      }
    })

    const captchaFrame = 'iframe[src*="https://geo.captcha"]';
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const isCaptchaFramePresent = await checkExistance(captchaFrame);
    if (isCaptchaFramePresent) {
      try {
        console.log('isCaptcha', true);
        await context.waitForNavigation({ timeout });
        // @ts-ignore
        // eslint-disable-next-line no-undef
        await context.evaluateInFrame('iframe', () => grecaptcha.execute());
        console.log('solved captcha, waiting for page change');
        await context.waitForNavigation({ timeout });
      } catch (e) { console.log('could not solve captcha') }
    }
  }
};