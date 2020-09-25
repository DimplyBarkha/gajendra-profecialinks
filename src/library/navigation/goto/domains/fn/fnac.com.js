
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
    dependencies
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setLoadAllResources(true);
    await context.goto(url, {
      antiCaptchaOptions: {
        provider: "2-captcha",
        type: "GEETEST",
      },
      timeout: timeout,
      waitUntil: "load",
      checkBlocked: false,
      js_enabled: true,
      load_timeout: 30,
      css_enabled: true,
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 10000))

    await context.evaluate(
      function () {
        const code = geetest.toString().replace(/appendTo\("#([^"]+)"\)/,'appendTo(document.getElementById("$1"))');
        return eval(`(${code})('/captcha/geetest');`);
      }, undefined, 'iframe');

    await new Promise((r) => setTimeout(r, 500));

    await context.evaluate(
      function () {
        document.querySelector(".captcha-handler").click();
      },
      undefined,
      "iframe"
    );

    await context.waitForNavigtion();
  },
};
