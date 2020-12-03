
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'pokupki.market.yandex.ru',
    timeout: 90000,
    country: 'RU',
    store: 'beru',
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
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);

    const captchaFrame = "no-script[src*='captcha']:not([title]), no-script[src*='captcha']:not([title])";
    try {
      await context.waitForSelector(captchaFrame);
    } catch (e) {
      console.log('Captcha frame not found', e);
    }
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      console.log('isCaptcha', true);
      await context.waitForNavigation({ timeout });
      // @ts-ignore
      // eslint-disable-next-line no-undef
      await context.evaluateInFrame('iframe', () => grecaptcha.execute());
      console.log('solved captcha, waiting for page change');
      await context.waitForNavigation({ timeout });
      try {
        await context.waitForSlector('.skuPage');
      } catch (e) {
        console.log('Details page selector not found');
      }
    }
  },
};
