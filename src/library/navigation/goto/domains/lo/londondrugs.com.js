module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'londondrugs.com',
    timeout: 70000,
    country: 'CA',
    store: 'londondrugs',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode, storeId },
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
    await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });

    const searchPageSelector = 'section.search-result-options';
    const searchPage = await context.evaluate(async (searchPageSelector) => {
      return Boolean(document.querySelector(searchPageSelector));
    }, searchPageSelector);

    if (searchPage) {
      let keyword = url.split('=')[3];
      keyword = keyword.toLowerCase();
      if (keyword === 'dyson') {
        await context.click('#learnMoreBTN');
        await context.waitForFunction(
          () => {
            return document.querySelector('.ld-sg-button.ld-sg-button--secondary.ld-sg-button--secondary-flex.js-load-more__btn.load-more__btn.hide');
          },
          { timeout },
        );
      }
    }
    const captchaFrame = 'iframe[src*="https://geo.captcha"]';
    // const delay = t => new Promise(resolve => setTimeout(resolve, t));
    // delay(20000);
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      console.log('isCaptcha', true);
      await context.waitForNavigation({ timeout });
      try {
        await context.waitForFunction(() => {
          return document.querySelector('iframe[src*="https://geo.captcha"]');
        }, { timeout });
        // @ts-ignore
        // eslint-disable-next-line no-undef
        await context.evaluateInFrame('iframe', () => grecaptcha.execute());
        console.log('solved captcha, waiting for page change');
        await context.waitForNavigation({ timeout });
      } catch (e) {
        console.log('Captcha did not load');
      }

      try {
        await context.waitForXPath('//span[@itemprop="productID"]', { timeout });
      } catch (e) {
        console.log('Redirecting to the product page');
        await context.evaluate((url) => {
          window.location.href = url;
        }, url);
        await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
      }
    }

    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
