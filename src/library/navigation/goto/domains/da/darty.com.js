module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'darty.com',
    timeout: 60000,
    country: 'FR',
    store: 'darty',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    // url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(false);
    await context.setAntiFingerprint(false);
    await context.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36');

    async function hasCaptcha() {
      return context.evaluateInFrame('iframe',
        function () {
          return !!window.geetest;
        }
      );
    }

    async function clickCaptcha() {
      return context.evaluateInFrame('iframe',
        async function () {
          const captchaHandler = document.querySelector('.captcha-handler');
          if (captchaHandler) {
            captchaHandler.click();
          }
          const radarTip = document.querySelector('.geetest_radar_tip_content')
          if (radarTip) {
            radarTip.click();
          }
          return { captchaHandler: !!captchaHandler, radarTip: !!radarTip, geetest: !!window.geetest };
        },
      );
    }

    async function printCaptchaStatus() {
      const status = await context.evaluateInFrame('iframe', async function () {
        return document.querySelector('body').getAttribute('captchastatus');
      });
      console.log('captchastatus was', status);
    }

    async function checkBlocked() {
      return context.evaluateInFrame('iframe', async function () {
        return document.querySelector('body').innerText.includes('You have been blocked.');
      });
    }

    async function dumpBlockedText() {
      const text = await context.evaluateInFrame('iframe', async function () {
        return document.querySelector('body').innerText
      });
      console.log('block text: ', text);
    }

    async function gotoPage(retries) {
      if (retries === 0) {
        console.log('retries exhausted');
        return;
      }

      const responseStatus = await context.goto(`${url}`, {
        antiCaptchaOptions: {
          provider: 'anti-captcha',
          type: 'GEETEST',
          autoSubmit: true,
        },
        firstRequestTimeout: 60000,
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: false,
      });
      console.log('Status :', responseStatus.status);
      console.log('URL :', responseStatus.url);

      await context.waitForNavigation({ timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        if (await checkBlocked()) {
          console.log('blocked');
          await dumpBlockedText();
          return context.reportBlocked(responseStatus.status, 'You have been blocked');
        }
        if (await hasCaptcha()) {
          console.log('found captcha');
          await clickCaptcha();
          await new Promise(resolve => setTimeout(resolve, 20000));
        } else {
          console.log('no captcha encountered');
        }
        await context.waitForSelector('#produit > div.product_head', { timeout: 60000 });
      } catch (error) {
        await printCaptchaStatus();
        console.log('error: ', error);
        return gotoPage(retries - 1);
      }
    }
  
    await gotoPage(3);

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
