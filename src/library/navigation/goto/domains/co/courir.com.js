
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

    async function gotoPage() {
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

        await context.waitForNavigation({ timeout: 30000 });
      } catch (err) {
        console.log('Error navigating to page.');
        throw err;
      }
    }

    await gotoPage();

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

        // wait for longer than 500ms here
        await new Promise(resolve => setTimeout(resolve, 10000));

        await context.evaluateInFrame('iframe', function () {
          // @ts-ignore
          document.querySelector('.captcha-handler').click();
        });

        console.log('Captcha Resolved.');
      } catch (error) {
          console.log('error: CAPTCHA error', error);
          throw error;
      }
      // we may sometimes be redirected to main page instead of detail page, re-check
      try {
        // this element exists on product pages
        await context.waitForSelector('#product-content', { timeout: 20000 });
      } catch(e) {
        // if timeout, attempt to go to initial page again
        await gotoPage();

        const isCaptchaFramePresent = await checkExistance(captchaSelector);
        if (isCaptchaFramePresent) {
          throw new Error('Got captcha a second time');
        }
      }
    } else {
      console.log('NO CAPTCHA ENCOUNTER');
    }
  },
};
