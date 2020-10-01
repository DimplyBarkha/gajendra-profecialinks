
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

    await context.evaluateInFrame('iframe[src*="https://geo.captcha"]',
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
    await context.evaluateInFrame('iframe[src*="https://geo.captcha"]',
      function () {
        document.querySelector('div.captcha__human__captcha-container').click();
      },git 
    );
    await new Promise(resolve => setTimeout(resolve, 60000));
    await context.waitForSelector('#pdpMain');
  },
};
