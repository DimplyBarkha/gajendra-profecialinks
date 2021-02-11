module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'courir.com',
    timeout: 60000,
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
    await context.setUseRelayProxy(false);

    const gotoPage = async () => {
      try {
        const responseStatus = await context.goto(url, {
          antiCaptchaOptions: {
            provider: 'anti-captcha',
            type: 'GEETEST',
            autoSubmit: true,
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
      await context.waitForNavigation({ timeout: 30000 });
    };

    const checkExistance = async (selector) => {
      return await context.evaluate(async (sel) => {
        return Boolean(document.querySelector(sel));
      }, selector);
    };

    const optionalWait = async (selector, timeout) => {
      try {
        await context.waitForSelector(selector, { timeout });
        console.log(`Found selector => ${selector}`);
        return true;
      } catch (err) {
        console.log('Couldn\'t load the selector ' + selector);
        return false;
      }
    };

    const delay = t => new Promise(resolve => setTimeout(resolve, t));

    await gotoPage();

    const captchaSelector = 'iframe[src*="https://geo.captcha"]';
    await optionalWait(captchaSelector, 60000);
    const isCaptchaFramePresent = await checkExistance(captchaSelector);

    console.log('isCaptcha', isCaptchaFramePresent);

    if (isCaptchaFramePresent) {
      try {
        const isHardBlocked = await context.evaluateInFrame(captchaSelector, function () {
          if (document.body.innerText.search('Vous avez été bloqué') > -1 || document.body.innerText.search('You have been blocked') > -1) {
            return true;
          }
          return false;
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
            return eval(`(${code})()`);
          },
        );

        await delay(500);
        await context.evaluateInFrame(captchaSelector, function () {
          // @ts-ignore
          document.querySelector('.captcha-handler').click();
        });



        // Wait for iframe to disappear
        let iframeStillExists = await checkExistance(captchaSelector);
        let isCaptchaSolved = await context.evaluateInFrame(captchaSelector, function () {
          return Boolean(document.querySelector('div[captchastatus="ok"]'));
        });

        let isCaptchaFailed = await context.evaluateInFrame(captchaSelector, function () {
          return Boolean(document.querySelector('div[captchastatus="fail"]'));
        });

        let counter = 0;
        while (iframeStillExists && !isCaptchaSolved && !isCaptchaFailed) {
          iframeStillExists = await checkExistance(captchaSelector);
          isCaptchaSolved = await context.evaluateInFrame(captchaSelector, function () {
            return Boolean(document.querySelector('div[captchastatus="ok"]'));
          });
          isCaptchaFailed = await context.evaluateInFrame(captchaSelector, function () {
            return Boolean(document.querySelector('div[captchastatus="fail"]'));
          });
          await delay(500);
          ++counter;

          // Waiting for a minute before throwing an error
          if (counter === 120 || isCaptchaFailed) {
            throw new Error('CAPTCHA_FAIL');
          }
        }

        console.log('Captcha Resolved.');

        await context.waitForNavigation({ timeout: 30000 });
        // we may be navigated to an index page after captcha solve
        const productPageSelector = '#product-content';
        const isWaitProduct = await optionalWait(productPageSelector, 30000);

        console.log('isProduct', isWaitProduct);
        const cookieButtonSelector = 'body > div.optanon-alert-box-wrapper > div.optanon-alert-box-bg > div.optanon-alert-box-button-container > div.optanon-alert-box-button.optanon-button-allow > div > button';
        const cookieButton = await optionalWait(cookieButtonSelector, 30000);
        console.log('isCookie', cookieButton);

        if (cookieButton) {
          try {
            console.log('Clicking on cookie accept button.');
            await context.click(cookieButtonSelector);
          } catch (err) {
            console.log('Error while accepting cookies.');
          }
        }

        if (!isWaitProduct) {
          await gotoPage();
          const isCaptchaFramePresent = await checkExistance(captchaSelector);
          console.log('SecondCaptchaFrame', isCaptchaFramePresent);
          if (isCaptchaFramePresent) {
            throw new Error('got captcha a second time');
          }
        }
      } catch (error) {
        console.log('CAPTCHA error: ', error);
        if (error.message === 'Blocked') {
          console.log('Blocked');
          await context.reportBlocked(403);
          console.log('Throw blocked error.')
          throw error;
        } else if (error.message === 'CAPTCHA_FAIL') {
          console.log('Captcha failed.');
          throw error;
        }
        throw error;
      }
    } else {
      console.log('NO CAPTCHA ENCOUNTER');
    }
  },
};
