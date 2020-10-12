
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'courir.com',
    timeout: 200000,
    country: 'FR',
    store: 'courir',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    // await context.setJavaScriptEnabled(true);
    // await context.setCssEnabled(true);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // await context.setBlockAds(false);

    try {
      const responseStatus = await context.goto(url, {
        antiCaptchaOptions: {
          provider: '2-captcha',
          type: 'GEETEST',
        },
        firstRequestTimeout: 60000,
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: true,
      });

      console.log('NAVIGATED SOMEWHERE.');
      console.log('Status :', responseStatus.status);
      console.log('URL :', responseStatus.url);
    } catch (err) {
      console.log('Error navigating to page.');
      throw err;
    }

    await context.waitForNavigation({ timeout: 30000 });

    const checkExistance = async (selector) => {
      return await context.evaluate(async (sel) => {
        return Boolean(document.querySelector(sel));
      }, selector);
    };

    const captchaSelector = 'iframe[src*="https://geo.captcha"]';
    const isCaptchaFramePresent = await checkExistance(captchaSelector);

    console.log('isCaptcha', isCaptchaFramePresent);

    if (isCaptchaFramePresent) {
      try {
        const isHardBlocked = await context.evaluateInFrame(captchaSelector, function () {
          return document.body.innerText.search('You have been blocked') > -1;
        });

        if (isHardBlocked) {
          console.log('IP is hard blocked');
          throw new Error('Blocked');
        }

        await context.evaluateInFrame(
          captchaSelector,
          function () {
            // @ts-ignore
            const code = geetest
              .toString()
              .replace(/appendTo\("#([^"]+)"\)/, 'appendTo(document.getElementById("$1"))');
            return eval(`(${code})('/captcha/geetest');`);
          },
        );

        await new Promise(resolve => setTimeout(resolve, 500));
        await context.evaluateInFrame('iframe', function () {
          // @ts-ignore
          document.querySelector('.captcha-handler').click();
        });

        console.log('Captcha Resolved.');

        await new Promise(resolve => setTimeout(resolve, 10000));
        await context.waitForSelector('#produit > div.product_head');
      } catch (error) {
        console.log('error: NO CAPTCHA ENCOUNTER', error);
        if (error.message === 'Blocked')
          throw error; // TODO what is the correct way to indicate retry from different virtual browser?
      }
    } else {
      console.log('NO CAPTCHA ENCOUNTER');
    }
  },
};
