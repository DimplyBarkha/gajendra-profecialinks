
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'shop.rewe.de',
    timeout: 60000,
    country: 'DE',
    store: 'rewe',
    zipcode: '',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: 60000,
      waitUntil: 'load',
      checkBlocked: false,
      store: 'rewe',
      country: 'DE',
      domain: 'shop.rewe.de',
      antiCaptchaOptions: {
        type: 'HCAPTCHA',
      },
    });

    await context.waitForSelector('#cf-hcaptcha-container iframe');
    await context.solveCaptcha({
      type: 'HCAPTCHA',
      inputElement: '#cf-hcaptcha-container iframe',  
      autoSubmit: true,
    });
  },
};
