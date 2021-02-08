
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'shop.coles.com.au',
    timeout: 60000,
    country: 'AU',
    // store: 'colesonline',
    store: 'colesonline_macquariePark',
    // store: 'colesonline_burwoodEast',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const memory = {};
    const backconnect = !!memory.backconnect;
    const benchmark = !!memory.benchmark;
    const MAX_CAPTCHAS = 3;
    let captchas = 0;

    await context.setBlockAds(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(true);

    const captchaFrame = 'div#iframe-wrapper iframe';
    // const captchaToken = '#recaptcha-token';

    const isCaptcha = async () => {
      return await context.evaluate(async function () {
        console.log("Checking for CAPTCHA-----------------------",!!document.querySelector("div#iframe-wrapper iframe"))
        return !!document.querySelector("div#iframe-wrapper iframe")
      })
    };
    console.log('isCaptcha: ', isCaptcha);
    const solveCaptcha = async () => {
      console.log('isCaptcha', true);

      await context.solveCaptcha({
        type: 'RECAPTCHA',
        inputElement: '.g-recaptcha',
        autoSubmit: true,
      });
      console.log('solved captcha, waiting for page change');
      const res = await Promise.race([
        context.waitForSelector('div#iframe-wrapper iframe'),
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
