
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'laredoute.fr',
    timeout: null,
    country: 'FR',
    store: 'laredoute',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    await context.evaluateInFrame(function () {
      const captchaCheckBox = document.querySelector('div.g-recaptcha');
      if (captchaCheckBox) {
        console.log('captchaCheckBox: ', captchaCheckBox);
        // @ts-ignore
        captchaCheckBox.click();
      }
    // @ts-ignore
    });
  },
};
