
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'but.fr',
    timeout: 90000,
    country: 'FR',
    store: 'but',
    zipcode: '',
  },
  // implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
  //   const timeout = parameters.timeout ? parameters.timeout : 90000;
  //   await context.setBlockAds(false);
  //   await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
  // },
  implementation: async (
    { url: longUrl },
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
    const url = longUrl.split('.aspx#')[0];

    const gotoOptions = {
      firstRequestTimeout: 60000,
      timeout,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    };
    const responseStatus = await context.goto(url, gotoOptions);
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);

    const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title])";
    const maxRetries = 3;
    let numberOfCaptchas = 0;

    try {
      await context.waitForSelector(captchaFrame);
    } catch(e) {
      console.log("Didn't find Captcha.");
    }

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };

    const checkRedirection = async () => {
      const newurl = await context.evaluate(() => window.location.href);
      return !newurl.includes(url);
    };

    let isCaptchaFramePresent = await checkExistance(captchaFrame);
    console.log("isCaptcha:"+ isCaptchaFramePresent);

    while (isCaptchaFramePresent && numberOfCaptchas < maxRetries) {
      console.log('isCaptcha', true);
      ++numberOfCaptchas;
      await context.waitForNavigation({ timeout });
      try {
        console.log(`Trying to solve captcha - count [${numberOfCaptchas}]`);
        // @ts-ignore
        // eslint-disable-next-line no-undef
        await context.evaluateInFrame('iframe', () => grecaptcha.execute());
        console.log('solved captcha, waiting for page change');
        await context.waitForNavigation({ timeout });
        const redirectionSuccess = await checkRedirection();

        if (redirectionSuccess) {
          console.log('Page was redirected');
          await context.goto(url, gotoOptions);
          await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
          break;
        }

        isCaptchaFramePresent = await checkExistance(captchaFrame);
      } catch (e) {
        console.log('Captcha did not load');
      }
    }

    isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      throw new Error('Failed to solve captcha');
    }
  },
};
