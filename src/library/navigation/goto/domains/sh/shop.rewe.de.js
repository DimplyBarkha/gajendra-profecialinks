
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'shop.rewe.de',
    timeout: 60000,
    country: 'DE',
    store: 'rewe',
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
        type: 'RECAPTCHA',
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);
    const captchaFrame = 'div#cf-hcaptcha-container iframe';
    try {
      await context.waitForSelector(captchaFrame);
    } catch (error) {
      console.log('error: without undescore ', error);
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
      await context.evaluateInFrame(captchaFrame, function () {
        // @ts-ignore
        document.querySelector(captchaFrame).click();
      });
      await context.solveCaptcha({ type: 'RECAPTCHA', inputElement: captchaFrame });
    }

    const hasAcceptLink = await context.evaluate((selector) => !!document.querySelector(selector), 'div#cf-hcaptcha-container iframe');
    if (hasAcceptLink) {
      await context.click('div#cf-hcaptcha-container iframe');
    }
  },
};
