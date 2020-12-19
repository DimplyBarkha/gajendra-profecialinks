
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'instacart.com',
    timeout: 120000,
    country: 'US',
    store: 'instacart_publix',
    zipcode: '32821',
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
   // await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);

    const responseStatus = await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);

    // const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title])";
    const captchaFrame = "iframe[_src*='https://www.google.com/recaptcha/api2/bframe?hl=en&v=qc5B-qjP0QEimFYUxcpWJy5B&k=6LfgstgZAAAAAO_TzxqxqR8E8Fu16VqIs1mBtAKH&cb=wh0kh64oc970']";
    const maxRetries = 3;
    let numberOfCaptchas = 0;

    try {
      await context.waitForSelector(captchaFrame);
    } catch (e) {
      console.log("Didn't find Captcha.");
    }

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };

    const checkRedirection = async () => {
      try {
        await context.waitForSelector('div.rc-imageselect-response-field', { timeout });
        console.log('Redirected to another page.');
        return true;
      } catch (e) {
        console.log('Redirection did not happen.');
        return false;
      }
    };

    let isCaptchaFramePresent = await checkExistance(captchaFrame);
    console.log("isCaptcha:" + isCaptchaFramePresent);

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
          await context.evaluate((url) => {
            window.location.href = url;
          }, url);
          await context.waitForNavigation({ timeout, waitUntil: '#store' });
          break;
        } else {
          await context.evaluate((url) => {
            // eslint-disable-next-line no-unused-expressions
            window.location.reload;
          });
          await context.waitForNavigation({ timeout, waitUntil: '#store' });
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