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
    try {
      await context.evaluateInFrame('iframe',
        function () {
          // @ts-ignore
          const code = geetest
            .toString()
            .replace(
              /appendTo\("#([^"]+)"\)/,
              'appendTo(document.getElementById("$1"))',
            );
          return eval(`(${code})('/captcha/geetest');`);
        },
      );

      await new Promise(resolve => setTimeout(resolve, 500));
      await context.evaluateInFrame('iframe',
        function () {
          // @ts-ignore
          if (document.querySelector('.captcha-handler')) {
            document.querySelector('.captcha-handler').click();
          }
          if (document.querySelector('.geetest_radar_tip_content')) {
            document.querySelector('.geetest_radar_tip_content').click();
          }
        },
      );
      await new Promise(resolve => setTimeout(resolve, 10000));
    } catch (error) {
      console.log('error: NO CAPTCHA ENCOUNTER', error);
    }
    try {
      await context.waitForSelector('#produit > div.product_head');
    } catch (error) {
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
      try {
        await context.evaluateInFrame('iframe',
          function () {
            // @ts-ignore
            const code = geetest
              .toString()
              .replace(
                /appendTo\("#([^"]+)"\)/,
                'appendTo(document.getElementById("$1"))',
              );
            return eval(`(${code})('/captcha/geetest');`);
          },
        );

        await new Promise(resolve => setTimeout(resolve, 500));
        await context.evaluateInFrame('iframe',
          function () {
            // @ts-ignore
            if (document.querySelector('.captcha-handler')) {
              document.querySelector('.captcha-handler').click();
            }
            if (document.querySelector('.geetest_radar_tip_content')) {
              document.querySelector('.geetest_radar_tip_content').click();
            }
          },
        );
        await new Promise(resolve => setTimeout(resolve, 15000));
        try {
          await context.waitForSelector('#produit > div.product_head');
          return;
        } catch(e) {
          console.log('captcha not solved, trying again');
        }
        const captchaStatus = await context.evaluateInFrame('iframe', async function () {
          return document.querySelector('body').getAttribute('captchastatus');
        });
        console.log('captcha status was ', captchaStatus);
        if (captchaStatus === 'ok') {
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
          try {
            await context.evaluateInFrame('iframe',
              function () {
                // @ts-ignore
                const code = geetest
                  .toString()
                  .replace(
                    /appendTo\("#([^"]+)"\)/,
                    'appendTo(document.getElementById("$1"))',
                  );
                return eval(`(${code})('/captcha/geetest');`);
              },
            );

            await new Promise(resolve => setTimeout(resolve, 500));
            await context.evaluateInFrame('iframe',
              function () {
                // @ts-ignore
                if (document.querySelector('.captcha-handler')) {
                  document.querySelector('.captcha-handler').click();
                }
                if (document.querySelector('.geetest_radar_tip_content')) {
                  document.querySelector('.geetest_radar_tip_content').click();
                }
              },
            );
            await new Promise(resolve => setTimeout(resolve, 15000));
            await context.waitForSelector('#produit > div.product_head');
          } catch (error) {
            console.log('Reload and resolve captcha failed: ', error);
          }
        };
      } catch (error) {
        console.log('error: FAILED TO SOLVE CAPTCHA AFTER RETRY', error);
      }
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
