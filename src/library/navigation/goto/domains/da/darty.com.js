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
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(false);
    await context.setAntiFingerprint(false);

    const responseStatus = await context.goto(`${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true}[/!opt!]`, {
      antiCaptchaOptions: {
        type: 'GEETEST',
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
      console.log('error: NO CPATCHA ENCOUNTER', error);
    }
    try {
      await context.waitForSelector('#produit > div.product_head');
    } catch (error) {
      const responseStatus = await context.goto(`${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true}[/!opt!]`, {
        antiCaptchaOptions: {
          type: 'GEETEST',
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
        await context.waitForSelector('#produit > div.product_head');
      } catch (error) {
        console.log('error: FAILED TO SOLVE CAPTCHA AFTER RETRY', error);
      }
    }
  },
};
