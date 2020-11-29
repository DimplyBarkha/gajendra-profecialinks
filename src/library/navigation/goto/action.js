// async function goto (url, context) {
// }

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fnac.es',
    timeout: 60000,
    country: 'ES',
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
    try {
      await context.waitForSelector('iframe[src*="captcha"],iframe[_src*="captcha"]');
      await context.evaluateInFrame('iframe[src*="captcha"],iframe[_src*="captcha"]',
        function () {
          // @ts-ignore
          const code = geetest
            .toString()
            .replace(
              /appendTo\("#([^"]+)"\)/,
              'appendTo(document.getElementById("$1"))',
            );

          console.log(`${code})('/captcha/geetest');`);
          return eval(`(${code})('/captcha/geetest');`);
        },
      );

      await new Promise(resolve => setTimeout(resolve, 500));
      await context.evaluateInFrame('iframe[src*="captcha"],iframe[_src*="captcha"]',
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
    if (await context.evaluate(() => !!document.querySelector('a[title="Close"]'))) {
      await context.click('a[title="Close"]');
    }
    if (await context.evaluate(() => !!document.querySelector('iframe[src*="captcha"],iframe[_src*="captcha"]'))) {
      return context.reportBlocked(responseStatus.status, 'Blocked: Could not solve CAPTCHA');
    }
  },
};
