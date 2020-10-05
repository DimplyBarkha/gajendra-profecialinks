
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fnac.com',
    timeout: 60000,
    country: 'FR',
    store: 'fnac',
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
    const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title])";

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      try {
        await context.evaluateInFrame('iframe',
          function () {
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
            document.querySelector('.captcha-handler').click();
          },
        );
        await new Promise(resolve => setTimeout(resolve, 60000));
        try {
          await context.waitForSelector('div[class~="f-productVisuals-mainIconZoom"]');
        } catch (e) {
          console.log('No details page');
        }
        try {
          await context.waitForSelector('div[class~="Article-itemInfo"] p[class~="Article-desc"]');
        } catch (e) {
          console.log('No details page');
        }
      } catch (e) {
        console.log('No captcha encountered');
      }
    }
  },
};
