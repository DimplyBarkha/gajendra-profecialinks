
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boots.com',
    country: 'UK',
    store: 'boots',
    zipcode: '',
    timeout: 90000,
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
    await context.setBlockAds(false);
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
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'networkidle0', block_ads: false, antiCaptchaOptions: { type: 'RECAPTCHA' } });
    const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title])";
    try {
      await context.waitForSelector(captchaFrame);
    } catch (e) {
      console.log('Captcha frame not found', e);
    }
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      console.log('isCaptcha', true);
      await context.waitForNavigation({ timeout });
      // @ts-ignore
      // eslint-disable-next-line no-undef
      // await context.evaluateInFrame('iframe', () => grecaptcha.execute());
      // console.log('solved captcha, waiting for page change');
      // await context.waitForNavigation({ timeout });
      // try {
      //   await context.waitForSelector('#corePage');
      // } catch (e) {
      //   console.log('Details page selector not found');
      // }
      const cssCaptcha = '.g-recaptcha';
      const solveCaptcha = async () => {
        console.log('..solveCaptcha..');
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: cssCaptcha,
        });
        // await context.reload(); // This is optional based on the website behavior.
        await new Promise(r => setTimeout(r, 500));
      };
      await solveCaptcha();
    }

    async function autoScroll (page) {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }
    await autoScroll(context);
  },
};
