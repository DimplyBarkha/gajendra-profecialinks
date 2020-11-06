
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boots.com',
    country: 'UK',
    store: 'boots',
    zipcode: '',
    timeout: 50000,
  },
  implementation: async ({ url }, { country, domain, timeout }, context, dependencies) => {

    // await context.setBlockAds(false);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // await context.setJavaScriptEnabled(true);
    // await context.setAntiFingerprint(false);
    // await context.setUseRelayProxy(false);

    // const responseStatus = await context.goto(url, {
    //   firstRequestTimeout: 60000,
    //   timeout: timeout,
    //   waitUntil: 'load',
    //   checkBlocked: false,
    //   antiCaptchaOptions: {
    //     type: 'RECAPTCHA',
    //   },
    // });
    // console.log('Status :', responseStatus.status);
    // console.log('URL :', responseStatus.url);

    // const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title])";
    // try {
    //   await context.waitForSelector(captchaFrame);
    // } catch (e) {
    //   console.log('Captcha frame not found', e);
    // }
    // const checkExistance = async (selector) => {
    //   return await context.evaluate(async (captchaSelector) => {
    //     return Boolean(document.querySelector(captchaSelector));
    //   }, selector);
    // };
    // const isCaptchaFramePresent = await checkExistance(captchaFrame);

    // if (isCaptchaFramePresent) {
    //   console.log('isCaptcha', true);
    //   await context.waitForNavigation({ timeout });
    //   // @ts-ignore
    //   // eslint-disable-next-line no-undef
    //   await context.evaluateInFrame('iframe', () => grecaptcha.execute());
    //   console.log('solved captcha, waiting for page change');
    //   await context.waitForNavigation({ timeout });
    //   try {
    //     await context.waitForSlector('#corePage');
    //   } catch (e) {
    //     console.log('Details page selector not found');
    //   }
    // }
    const newUrl = await context.evaluate(function (url) {
      const searchTerm =
        url.match(/https:\/\/www.boots.com\/sitesearch\?searchTerm=(.+)/) &&
        url
          .match(/https:\/\/www.boots.com\/sitesearch\?searchTerm=(.+)/)[1]
          .toLowerCase();
      if (searchTerm &&
          searchTerm.match(/[a-zA-Z]+/g) &&
          searchTerm.match(/[a-zA-Z]+/g).length === 1 &&
          searchTerm.match(/dyson/i)
      ) {
        return 'https://www.boots.com/dyson/dyson-shop-all';
      } else {
        return false;
      };
    }, url);
    url = newUrl || url;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
  },
};
