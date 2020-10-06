
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'courir.com',
    timeout: 200000,
    country: 'FR',
    store: 'courir',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(false);

    const responseStatus = await context.goto(url, {
      antiCaptchaOptions: {
        provider: '2-captcha',
        type: 'GEETEST',
      },
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
    });
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);

    // TODO is this needed? I don't think so.
    // await context.waitForNavigation({ timeout: 30000 });

    const checkExistance = async (selector) => {
      return await context.evaluate(async (selector) => {
        return Boolean(document.querySelector(selector));
      }, selector);
    };

    const captchaSelector = '#captcha-container';
    const isCaptchaFramePresent = await checkExistance(captchaSelector);

    console.log('isCaptcha', isCaptchaFramePresent);

    if (isCaptchaFramePresent) {
      await context.solveCaptcha({
        type: 'GEETEST',
        inputElement: captchaSelector,
        autoSubmit: true,
      });

      console.log('solved captcha, waiting for page change');

      // TODO check that both of the below are also needed
      await context.waitForNavigation({ timeout });
      await context.waitForSelector('#pdpMain');
    }
  },
};
