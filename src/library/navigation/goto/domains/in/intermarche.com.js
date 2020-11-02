
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'intermarche.com',
    timeout: 60000,
    country: 'FR',
    store: 'intermarche',
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
    let captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title]), div.captcha";
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
      // @ts-ignore
      // eslint-disable-next-line no-undef
      await context.evaluateInFrame('iframe', () => grecaptcha.execute());
      console.log('solved captcha, waiting for page change');
      await context.waitForNavigation(timeout);
    }

    // Check for correct store
    const correctStore = await context.evaluate(() => {
      return document.querySelector('[id="pdv-navbar"] button') ? document.querySelector('[id="pdv-navbar"] button').textContent === 'Brienne le Chateau' : false;
    });
    if (!correctStore) {
      await context.goto('https://www.intermarche.com/accueil/magasins/02111/brienne-le-chateau-10500');
      await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    }
    const hasAcceptLink = await context.evaluate((selector) => !!document.querySelector(selector), "a.didomi-popup-close.didomi-no-link-style");
    if (hasAcceptLink) {
      await context.click("a.didomi-popup-close.didomi-no-link-style")
    }
  },
};
