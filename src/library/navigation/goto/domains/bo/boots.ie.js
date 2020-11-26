
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boots.ie',
    country: 'IE',
    store: 'boots',
    zipcode: '',
    timeout: 500000,
  },
  implementation: async ({ url , zipcode, storeId} , parameters ,context, dependencies) => {
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
     // await context.evaluateInFrame('iframe', () => grecaptcha.execute());
     // await context.solveCaptcha({ type: 'RECAPTCHA', inputElement: '.g-recaptcha' });
      console.log('solved captcha, waiting for page change');
      await context.waitForNavigation(timeout);
    }

    // Check for correct store
    const correctStore = await context.evaluate(() => {
      return document.querySelector('[id="pdv-navbar"] button') ? document.querySelector('[id="pdv-navbar"] button').textContent === 'Brienne le Chateau' : false;
    });
    if (!correctStore) {
      await context.goto('https://queue.boots.ie/softblock/?c=boots&e=earlyblackfriday');
      await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    }
    const hasAcceptLink = await context.evaluate((selector) => !!document.querySelector(selector), '#recaptcha-anchor > div.recaptcha-checkbox-border');
    if (hasAcceptLink) {
      await context.click('#recaptcha-anchor > div.recaptcha-checkbox-border')
    }

    const newUrl = await context.evaluate(function (url) {
      const searchTerm =
        url.match(/https:\/\/www.boots.ie\/sitesearch\?searchTerm=(.+)/) &&
        url
          .match(/https:\/\/www.boots.ie\/sitesearch\?searchTerm=(.+)/)[1]
          .toLowerCase();
      if (searchTerm &&
          searchTerm.match(/[a-zA-Z]+/g) &&
          searchTerm.match(/[a-zA-Z]+/g).length === 1 &&
          searchTerm.match(/dyson/i)
      ) {
        return 'https://www.boots.ie/dyson/dyson-shop-all';
      } else {
        return false;
      };
    }, url);
    url = newUrl || url;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });

  },
};
