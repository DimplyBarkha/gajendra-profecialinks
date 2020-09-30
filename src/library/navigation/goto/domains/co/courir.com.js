
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
      timeout: 50000,
      waitUntil: 'load',
      checkBlocked: true,
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

    const isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      console.log('isCaptcha', true);
      // context.evaluateInFrame(captchaFrame, () => grecaptcha.execute());

      await context.evaluateInFrame('iframe', () => {
        const code = geetest.toString().replace(/appendTo\("#([^"]+)"\)/g, 'appendTo(document.getElementById("$1"))');
        console.log(code);
        return eval(`(${code})('/captcha/geetest');`);
      });

      await context.evaluateInFrame('iframe', () => {
        document.querySelector('.geetest_radar_tip_content').click();
      });

      // await context.solveCaptcha({
      //   type: 'GEETEST',
      //   inputElement: 'div.captcha__human__captcha-container',
      //   autoSubmit: true,
      // });
      console.log('solved captcha, waiting for page change');
      await new Promise(r => setTimeout(r, 50000));
      await context.waitForNavigation({ timeout });
    }
  },
};
