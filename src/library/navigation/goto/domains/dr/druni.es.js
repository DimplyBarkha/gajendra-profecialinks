
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'druni.es',
    timeout: 30000,
    country: 'ES',
    store: 'druni',
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
