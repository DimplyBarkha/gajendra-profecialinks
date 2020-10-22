
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'courir.com',
    timeout: 300000,
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
            provider: '2-captcha',
            type: 'GEETEST',
          },
          firstRequestTimeout: 60000,
          timeout,
          waitUntil: 'load',
          checkBlocked: true,
        });
        console.log('Status :', responseStatus.status);
        console.log('URL :', responseStatus.url);
        await context.waitForNavigation({ timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.log('Error navigating to page.');
        throw err;
      }
    };

    const checkExistence = async (selector) => {
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

    await gotoPage();

    const captchaSelector = 'iframe[src*="https://geo.captcha"]';
    let isCaptchaFramePresent = await checkExistence(captchaSelector);

    console.log('isCaptcha', isCaptchaFramePresent);

    if (isCaptchaFramePresent) {
      try {
        let isHardBlocked = await context.evaluateInFrame(
          captchaSelector,
          function () {
            return document.body.innerText.search('You have been blocked') > -1;
          },
        );
        if (isHardBlocked) {
          console.log('IP is hard blocked');
          return context.reportBlocked(451, 'Blocked!');
          // throw new Error('Blocked');
        }
        await context.evaluateInFrame(
          captchaSelector,
          function () {
            // eslint-disable-next-line
            const code = geetest
              .toString()
              .replace(/appendTo\("#([^"]+)"\)/, 'appendTo(document.getElementById("$1"))');
            // eslint-disable-next-line
            return eval(`(${code})()`);
          },
        );

        await new Promise(resolve => setTimeout(resolve, 500));
        await context.evaluateInFrame('iframe',
          function () {
            // @ts-ignore
            document.querySelector('.captcha-handler').click();
          },
        );
        console.log('Captcha Resolved.');
        await new Promise(resolve => setTimeout(resolve, 500));
        await context.waitForNavigation({ timeout: 30000 });
        // we may be navigated to an index page after captcha solve
        let productPageSelector = '#product-content';

        if (url.includes('search')) {
          productPageSelector = '#search-result-items';
        }
        // await context.waitForSelector(productPageSelector);
        let isWaitProduct = await optionalWait(productPageSelector);

        console.log('isProduct', isWaitProduct);

        const cookieButtonSelector = 'body > div.optanon-alert-box-wrapper > div.optanon-alert-box-bg > div.optanon-alert-box-button-container > div.optanon-alert-box-button.optanon-button-allow > div > button';
        const cookieButton = await optionalWait(cookieButtonSelector);
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
          isCaptchaFramePresent = await checkExistence(captchaSelector);
          console.log('SecondCaptchaFrame', isCaptchaFramePresent);
          if (isCaptchaFramePresent) {
            console.log('got captcha a second time');
            isHardBlocked = await context.evaluateInFrame(
              captchaSelector,
              function () {
                return document.body.innerText.search('You have been blocked') > -1;
              },
            );
            if (isHardBlocked) {
              console.log('IP is hard blocked');
              return context.reportBlocked(451, 'Blocked!');
              // throw new Error('Blocked');
            }
            await context.evaluateInFrame(
              captchaSelector,
              function () {
                // eslint-disable-next-line
                const code = geetest
                  .toString()
                  .replace(/appendTo\("#([^"]+)"\)/, 'appendTo(document.getElementById("$1"))');
                // eslint-disable-next-line
                return eval(`(${code})()`);
              },
            );

            await new Promise(resolve => setTimeout(resolve, 500));
            await context.evaluateInFrame('iframe',
              function () {
                // @ts-ignore
                document.querySelector('.captcha-handler').click();
              },
            );
            console.log('Captcha Resolved.');
            await new Promise(resolve => setTimeout(resolve, 500));
            await context.waitForNavigation({ timeout: 30000 });
            isWaitProduct = await optionalWait(productPageSelector);
            if (!isWaitProduct) {
              await gotoPage();
              isCaptchaFramePresent = await checkExistence(captchaSelector);
              console.log('ThirdCaptchaFrame', isCaptchaFramePresent);
              if (isCaptchaFramePresent) {
                throw new Error('got captcha a third time');
              }
            }
          }
        }
      } catch (error) {
        console.log('error: NO CAPTCHA ENCOUNTER', error);
        if (error.message === 'Blocked') { return context.reportBlocked(451, 'Blocked! Error - ' + error); }
        // throw error;
      }
    } else {
      console.log('NO CAPTCHA ENCOUNTER');
    }
  },
};
