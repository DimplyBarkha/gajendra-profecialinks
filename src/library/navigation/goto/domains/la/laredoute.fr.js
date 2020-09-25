
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
    await context.goto({
      url,
      options: {
        antiCaptchaOptions: {
          type: 'RECAPTCHA',
        },
        // anti_fingerprint: false,
        proxy: {
          use_relay_proxy: false,
        },
      },
    });

    // await context.execute(() => grecaptcha.execute(), undefined, 'iframe');
  },
};
