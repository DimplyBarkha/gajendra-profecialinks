
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmart.ca',
    timeout: 20000,
    country: 'CA',
    store: 'walmart',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const { url, zipcode, storeId } = inputs;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    const newUrl = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;

    const responseStatus = await context.goto(newUrl, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        provider: '2-captcha',
        type: 'RECAPTCHA',
      },
    });
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);

    const captchaFrame = 'iframe[_src*="captcha"]:not([title]), iframe[src*="captcha"]:not([title]), div.g-recaptcha';
    try {
      await context.waitForSelector(captchaFrame);
    } catch (error) {
      console.log('captcha not present : ', error);
    }

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

    console.log('captchaFrame : ', captchaFrame);
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    try {
      const isCaptchaFramePresent = await checkExistance(captchaFrame);
      if (isCaptchaFramePresent) {
        console.log('isCaptcha', true);
        const captchaRes = await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: '.g-recaptcha',
          autoSubmit: true,
        });
        console.log('captcha response----->', captchaRes);
        console.log('solved captcha, waiting for page change');
        await ifThereClickOnIt('main div[class="captcha"] > form > input');
        await context.waitForNavigation({ timeout });
      }
    } catch (error) {
      console.log('captcha code failed');
    }

    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
