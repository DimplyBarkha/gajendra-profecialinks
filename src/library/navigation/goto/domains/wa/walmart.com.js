
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
    const memory = {};
    const backconnect = !!memory.backconnect;
    const benchmark = !!memory.benchmark;
    const MAX_CAPTCHAS = 3;
    let captchas = 0;

    await context.setBlockAds(false);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(true);
    await context.setUseRelayProxy(true);

    const captchaFrame = 'div.g-recaptcha iframe';
    // const captchaToken = '#recaptcha-token';

    const isCaptcha = async () => {
      return await context.evaluate(async function () {
        return !!document.querySelector('div.re-captcha')
      })
    };

    const solveCaptcha = async () => {
      console.log('isCaptcha', true);

      await context.solveCaptcha({
        type: 'RECAPTCHA',
        inputElement: '.g-recaptcha',
        autoSubmit: true,
      });
      console.log('solved captcha, waiting for page change');
      const res = await Promise.race([
        context.waitForSelector('span[data-automation-id="zero-results-message"], .g-recaptcha, div[data-type="items"]'),
        new Promise((r, j) => setTimeout(j, 2e4 )),
      ]);
        
      console.log('Captcha vanished');
    };

    const solveCaptchaIfNecessary = async () => {
      console.log('Checking for CAPTCHA');
      while (await isCaptcha() && captchas < MAX_CAPTCHAS) {
        if (backconnect) {
          throw Error('CAPTCHA received');
        }
        console.log('Solving a captcha');       
        console.log("captcha start time:", new Date())
        await solveCaptcha();
        captchas += 1
        console.log("captcha end time:", new Date())
        await new Promise(resolve => setTimeout(resolve,10000));
      }
      if (await isCaptcha()) {
        if (!benchmark) {
          // we failed to solve the CAPTCHA
          console.log('We failed to solve the CAPTCHA');
          return context.reportBlocked(lastResponseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
        }
        return false;
      }
      return true;
    };

    await context.goto(url, {
      firstRequestTimeout: 40000,
      timeout,
      waitUntil: 'load',
      checkBlocked: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });

    if (!await solveCaptchaIfNecessary()) {
      return;
    }

  },
};
