
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'intermarche.com',
    timeout: 50000,
    zipcode: '',
    store: 'Intermarche',
    country: 'FR',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const maxRetries = 3;
    let numberOfCaptchas = 0;

    // await context.setBlockAds(false);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // await context.setJavaScriptEnabled(true);
    // await context.setAntiFingerprint(false);
    // await context.setUseRelayProxy(false);
    await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      }
    })
    const captchaFrame = '#captcha-submit > div > div > iframe';

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    let isCaptchaFramePresent = await checkExistance(captchaFrame);
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