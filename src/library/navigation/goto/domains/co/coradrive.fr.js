
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'coradrive.fr',
    timeout: 50000,
    country: 'FR',
    store: 'coradrive',
    zipcode: '',
  },
  implementation: async (
    { url },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(false);

    const responseStatus = await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    try {
      await context.waitForSelector('div[class*="popin_text_container"] a[class*="popin_link"]');
      await context.click('div[class*="popin_text_container"] a[class*="popin_link"]');
    } catch (error) {
      console.log('Close pop up button not present!!');
    }
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);
    const captchaFrame = 'iframe[_src*="captcha"]:not([title]), iframe[src*="captcha"]:not([title]), div.g-recaptcha';
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
    try {
      const isCaptchaFramePresent = await checkExistance(captchaFrame);
      if (isCaptchaFramePresent) {
        console.log('isCaptcha', true);
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: '.g-recaptcha',
        });
        console.log('solved captcha, waiting for page change');
        await context.waitForNavigation({ timeout: 30000 });
      }
    } catch (error) {
      console.log('captcha code failed');
    }

    try {
      await context.waitForXPath('//div[@id="slides"]', { timeout });
    } catch (error) {
      console.log('error: ', error);
    }

    try {
      await context.waitForSelector('div[class*="popin_text_container"] a[class*="popin_link"]');
      await context.click('div[class*="popin_text_container"] a[class*="popin_link"]');
    } catch (error) {
      console.log('Close pop up button not present!!');
    }
  },
};
