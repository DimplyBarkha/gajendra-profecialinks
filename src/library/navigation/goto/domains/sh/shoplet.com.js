
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'shoplet.com',
    timeout: 100000,
    country: 'US',
    store: 'shoplet',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false,firstRequestTimeout:60000,antiCaptchaOptions:{type: 'RECAPTCHA'} });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  }
};
