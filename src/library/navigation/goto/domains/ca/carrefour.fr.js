
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.fr',
    timeout: 90000,
    country: 'FR',
    store: 'carrefour',
    zipcode: '',
  },
  implementation: async (
    { url },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

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
    let captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title]), div.g-recaptcha";
    try {
      await context.waitForSelector(captchaFrame);
    } catch (error) {
      console.log('error: without undescore ', error);
    }

    console.log('captchaFrame', captchaFrame);
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const isCaptchaFramePresent = await checkExistance(captchaFrame);
    // const isCaptchaFramePresent = true;
    if (isCaptchaFramePresent) {
      console.log('isCaptcha', true);
      await context.waitForNavigation({ timeout });
      // @ts-ignore
      // eslint-disable-next-line no-undef
      await context.evaluateInFrame('iframe', () => grecaptcha.execute());
      console.log('solved captcha, waiting for page change');
      await context.waitForNavigation({ timeout });
      await context.waitForXPath('//div[@id="product-detail-page"]|//div[@id="products"]| //button[@id="footer_tc_privacy_button"]', { timeout });
      try {
        await context.waitForXPath('//button[@id="footer_tc_privacy_button"]', { timeout });
        await context.evaluateInFrame('iframe', () => {
          function closePopups() {
            let cookieButton = document.querySelector('button#footer_tc_privacy_button');
            if (cookieButton) {
              // @ts-ignore
              cookieButton.click();
            }
            let banner = document.querySelector('button.modal__close');
            if (banner) {
              // @ts-ignore
              banner.click();
            }
          }
          closePopups();
        });
      } catch (error) {
        console.log('error: ', error);
      }
    }
  },
};
