
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'emag.ro',
    timeout: 30000,
    country: 'RO',
    store: 'emag',
    zipcode: '',
  },
  implementation: async (
    { url },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;

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

    const captchaButton = 'div.captcha-button button';

    try {
      await context.waitForSelector(captchaButton);
    } catch (e) {
      console.log("Didn't find captcha button.");
    }

    await context.evaluate(async function () {
      const captchaButton = document.querySelector('div.captcha-button button.emg-button.emg-btn-large.emg-btn-full');
      if (captchaButton) {
        console.log('Found button to captcha which i will try to .click() here it is ->', captchaButton);
        captchaButton.click();
      }
    });

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };

    // click on the button using context.click, not working as well
    // const isCaptchaButtonPresent = await checkExistance('div.captcha-button button.emg-button.emg-btn-large.emg-btn-full');
    // if (isCaptchaButtonPresent) console.log('captcha button exist');
    // if (isCaptchaButtonPresent) await context.click('div.captcha-button button.emg-button.emg-btn-large.emg-btn-full');

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const captchaFrame = 'iframe[title="testare reCAPTCHA"]';
    const maxRetries = 3;
    let numberOfCaptchas = 0;
    try {
      await context.waitForSelector(captchaFrame);
    } catch (e) {
      console.log("Didn't find Captcha.");
    }

    const checkRedirection = async () => {
      try {
        await context.waitForSelector('h2.product-title, a[href="/user/login"]', { timeout });
        console.log('Redirected to another page.');
        return true;
      } catch (e) {
        console.log('Redirection did not happen.');
        return false;
      }
    };

    let isCaptchaFramePresent = await checkExistance(captchaFrame);
    console.log('isCaptcha:' + isCaptchaFramePresent);

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
          await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
          break;
        } else {
          await context.evaluate((url) => {
            // eslint-disable-next-line no-unused-expressions
            window.location.reload;
          });
          await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
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
