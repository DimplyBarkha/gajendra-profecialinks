
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
      discard_CSP_header: true,
      embed_iframes: true,
      images_enabled: true,
      load_all_resources: true,
      force200: true,
      block_ads: true,
      anti_fingerprint: true,
      first_request_timeout: 100,
      goto_timeout: 100,
      random_move_mouse: false,
      load_timeout: 30,
      antiCaptchaOptions: {
        provider: '2-captcha',
        type: 'GEETEST',
      },
    });
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);
    const captchaFrame = 'iframe[src*="https://geo.captcha"]';
    // const captchaSelector = '.g-recaptcha';
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaFrame) => {
        console.log('captcha present');
        return Boolean(document.querySelector(captchaFrame));
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
      await new Promise(r => setTimeout(r, 50000));
      await context.waitForNavigation({ timeout });
    }
  },
};
