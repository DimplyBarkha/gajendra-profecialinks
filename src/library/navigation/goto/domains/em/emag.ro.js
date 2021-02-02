
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'emag.ro',
    timeout: 30000,
    country: 'RO',
    store: 'emag',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":90000, "force200": true}[/!opt!]`;

    await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: 30000,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    await context.waitForNavigation();
  },
};
