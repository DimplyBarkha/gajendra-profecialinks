
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'courir.com',
    timeout: 30000,
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
        timeout,
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

    await context.waitForNavigation({ timeout, waitUntil: 'load' });

    const checkExistance = async (selector) => {
      return await context.evaluate(async (sel) => {
        return Boolean(document.querySelector(sel));
      }, selector);
    };

    const optionalWait = async (selector) => {
      try {
        await context.waitForSelector(selector, { timeout });
        console.log(`Found selector => ${selector}`);
        return true;
      } catch (err) {
        console.log('Couldn\'t load the selector ' + selector);
        return false;
      }
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
        await context.waitForNavigation({ waitUntil: 'load', timeout });
      } catch (error) {
        console.log('error: NO CAPTCHA ENCOUNTER', error);
        if (error.message === 'Blocked') {
          await context.reportBlocked(403)
          throw error;
        }
      }
    } else {
      console.log('NO CAPTCHA ENCOUNTER');
    }

    const cookieButton = await optionalWait('button.accept-cookies-button');

    if (cookieButton) {
      console.log('Clicking on cookie accept button.');
      await context.click('button.accept-cookies-button');
    }
  },
};
