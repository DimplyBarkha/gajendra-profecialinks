
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.fr',
    timeout: 90000,
    country: 'FR',
    store: 'carrefour',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    console.log("BEFORE GOTO");
   
      await context.setAntiFingerprint(false);
      await context.setLoadAllResources(true);
      await context.setBlockAds(false);
      // await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
      await context.goto(url,  {
        timeout: 50000, waitUntil: 'load', checkBlocked: true,
        antiCaptchaOptions: {
        type: 'RECAPTCHA',
        },
        // proxy: {
        //   use_relay_proxy: false
        // },
        });
  }
};
