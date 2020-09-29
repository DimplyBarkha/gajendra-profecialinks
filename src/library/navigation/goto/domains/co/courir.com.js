
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'courir.com',
    timeout: null,
    country: 'FR',
    store: 'courir',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);

    const responseStatus = await context.goto(url, {
      js_enabled: true,
      css_enabled: true,
      load_timeout: 30,
      load_all_resources: true,
      antiCaptchaOptions: {
        provider: '2-captcha',
        type: 'GEETEST',
      },
    });
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);
    const captchaFrame = 'iframe[_src*="https://geo.captcha"]';
    // const captchaSelector = '.g-recaptcha';
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        console.log('captcha present');
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    // await checkExistance(captchaSelector);
    const isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      console.log('isCaptcha', true);
      // context.evaluateInFrame(captchaFrame, () => grecaptcha.execute());
      await context.solveCaptcha({
        type: 'GEETEST',
        inputElement: 'div.captcha__human__captcha-container',
        autoSubmit: true,
      });
      console.log('solved captcha, waiting for page change');
      await context.waitForNavigation({ timeout });
    }
  },
};
