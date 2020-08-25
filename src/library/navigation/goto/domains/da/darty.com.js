
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'darty.com',
    timeout: 20000,
    country: 'FR',
    store: 'darty',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, {
      antiCaptchaOptions: {
        type: 'GEETEST',
        libPath: '',
      },
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
    });

    try {
      await context.waitForSelector('div.product_body');
    } catch (error) {
      try {
        await context.waitForSelector('div.geetest_btn');
      } catch (error) {
        
      }
      await context.solveCaptcha({
        type: 'GEETEST',
        inputElement: 'div.geetest_btn',
      });
    }

    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
