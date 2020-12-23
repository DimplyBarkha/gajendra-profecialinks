
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'build.com',
    timeout: 50000,
    country: 'US',
    store: 'build',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    // url = `${url}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]`;
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);

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

    const ifThereClickOnIt = async (selector) => {
      try {
        await context.waitForSelector(selector, { timeout: 5000 });
      } catch (error) {
        console.log(`The following selector was not found: ${selector}`);
        return false;
      }
      const hasItem = await context.evaluate((selector) => {
        return document.querySelector(selector) !== null;
      }, selector);
      if (hasItem) {
        // try both click
        try {
          await context.click(selector, { timeout: 2000 });
        } catch (error) {
          // context click did not work and that is ok
        }
        await context.evaluate((selector) => {
          const elem = document.querySelector(selector);
          if (elem) elem.click();
        }, selector);
        return true;
      }
      return false;
    };
    try {
      await ifThereClickOnIt('div[class*="container-accept-all"] button[class*="btn-accept-all"]');
    } catch (error) {
      console.log('failed to close iframe popup');
    }

    const captchaFrame = 'iframe[_src*="captcha"]:not([title]), iframe[src*="captcha"]:not([title]), div.g-recaptcha';
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
        await context.waitForSelector('#site-nav', { timeout });
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
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: '.g-recaptcha',
        //   autoSubmit: true,
        });
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
    try {
      await context.click('div[aria-label="close modal"]');
    } catch (error) {
      console.log('no modal found');
    }
    try {
      await context.click('button[class*=js-modal-close]');
    } catch (error) {
      console.log('no modal found');
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 20000));
  },
};
