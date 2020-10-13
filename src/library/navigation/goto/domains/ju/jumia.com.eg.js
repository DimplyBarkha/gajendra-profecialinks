
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jumia.com.eg',
    timeout: 30000,
    country: 'EG',
    store: 'jumia',
    zipcode: '',
  },

  implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    // await context.setBlockAds(false);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // await context.setJavaScriptEnabled(true);
    // await context.setAntiFingerprint(false);
    // await context.setUseRelayProxy(false);
    // await context.goto(url, {
    // firstRequestTimeout: 40000,
    //   timeout: timeout,
    //     waitUntil: 'load',
    //       checkBlocked: false,
    //         antiCaptchaOptions: {
    //   type: 'RECAPTCHA',
    //   },
    // });

    url = `${url}#[!opt!]{"force200": true}[/!opt!]`;
    await context.goto(url, {
      firstRequestTimeout: timeout,
      timeout,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    const captchaFrame = 'iframe[src*="https://assets.hcaptcha"]';
    const checkExistance = async (selector) => {
      return await context.evaluate((captchaSelector) => {
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
      } catch (e) {
        console.log('could not solve captcha');
      }
    }

    try {
      await context.waitForSelector('button[data-track-onclick="popupClose"]', { timeout });
      console.log("found pop up");
      await context.evaluate(function () {
        document.querySelector('button[data-track-onclick="popupClose"]').click();
      });
    }
    catch (err) {
      console.log("no pop up found");
    }
  },
};
