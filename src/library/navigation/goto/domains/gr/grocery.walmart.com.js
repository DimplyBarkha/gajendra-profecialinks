// @ts-nocheck

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'grocery.walmart.com',
    country: 'US',
    store: 'walmartOG',
    timeout: 180000,
  },

  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const memory = {};
    const backconnect = !!memory.backconnect;
    const benchmark = !!memory.benchmark;
    const MAX_CAPTCHAS = 3;
    let captchas = 0;

    await context.setBlockAds(false);
    await context.setJavaScriptEnabled(true);
    // await context.setAntiFingerprint(true);
    await context.setAntiFingerprint(false);
    // await context.setUseRelayProxy(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);

    const captchaSelector = 'div.g-recaptcha';

    const isCaptcha = async () => {
      return await context.evaluate(async (captchaSelector) => {
        return !!document.querySelector(captchaSelector);
      }, captchaSelector);
    };

    const solveCaptcha = async () => {
      console.log('isCaptcha', true);

      await context.solveCaptcha({
        type: 'RECAPTCHA',
        inputElement: '.g-recaptcha',
        autoSubmit: true,
      });
      console.log('solved captcha, waiting for page change');
      await Promise.race([
        context.waitForNavigation(),
        context.waitForSelector('span[data-automation-id="zero-results-message"], .g-recaptcha, div[id="product-overview"], section[id="shoppingContent"]'),
        await new Promise((resolve, reject) => setTimeout(reject, 5000)),
      ]);

      console.log('Captcha vanished');
    };

    const solveCaptchaIfNecessary = async (lastResponseData) => {
      console.log('Checking for CAPTCHA');
      while (await isCaptcha() === 'true' && captchas < MAX_CAPTCHAS) {
        if (backconnect) throw Error('CAPTCHA received');
        await context.waitForSelector('iframe[role="presentation"]', { timeout: 120000 });

        console.log('Solving a captcha, captcha start time:', new Date());

        await solveCaptcha();
        captchas += 1;
        console.log('captcha end time:', new Date());
        await new Promise(resolve => setTimeout(resolve, 10000));
      }

      if (await isCaptcha()) {
        console.log(`isCaptcha() has returned true. Now will check for benchmark - ${benchmark}`);
        if (!benchmark) {
          // we failed to solve the CAPTCHA
          console.log('We failed to solve the CAPTCHA');
          return context.reportBlocked(lastResponseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
        }
        return false;
      }
      return true;
    };

    const gotoParams = {
      firstRequestTimeout: 40000,
      timeout,
      waitUntil: 'load',
      checkBlocked: true,
      css_enabled: false,
      random_move_mouse: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    };
    const navigationTrajectory = [
      'https://www.walmart.com/grocery',
      url,
    ];
    let hasSetZipCode = false;
    for (let index = 0; index < navigationTrajectory.length; index++) {
      const destinationURL = navigationTrajectory[index];
      const lastResponseData = await context.goto(destinationURL, gotoParams);
      await solveCaptchaIfNecessary(lastResponseData);
      if (zipcode && !hasSetZipCode) {
        await dependencies.setZipCode({ zipcode });
        hasSetZipCode = true;
      }
    }
  },
};
