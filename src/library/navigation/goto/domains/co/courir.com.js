
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
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(false);

    const responseStatus = await context.goto(url, {
      antiCaptchaOptions: {
        provider: '2-captcha',
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
            document.querySelector('.captcha-handler').click();
          },
        );
        await new Promise(resolve => setTimeout(resolve, 60000));
        await context.waitForSelector('#produit > div.product_head');
      } catch (error) {
        console.log('error: NO CPATCHA ENCOUNTER', error);
      }

    }
  },
};
