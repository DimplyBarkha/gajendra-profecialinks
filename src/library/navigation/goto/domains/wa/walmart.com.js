
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmart.com',
    country: 'US',
    store: 'walmart',
    timeout: 60000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(true);
    await context.setUseRelayProxy(true);

    await context.goto(url, {
      firstRequestTimeout: 40000,
      timeout,
      waitUntil: 'load',
      checkBlocked: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA_V3',
        minScore: 0.3,
      },
    });
    const captchaFrame = 'div.g-recaptcha iframe';
    // const captchaToken = '#recaptcha-token';

    await context.waitForSelector(captchaFrame, 2000)
      .catch(() => console.log(`${captchaFrame} is not present`))
      .then(async () => {
        console.log('has capatcha, attempting solving');
        await context.solveCaptcha({ type: 'RECAPTCHA', inputElement: '.g-recaptcha' });
        console.log('solved captcha, waiting for page change');
        await context.waitForNavigation(timeout);
      });
  },
};
