
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmarttogo.api',
    timeout: null,
    jsonToTable: null,
    country: 'US',
    store: 'walmarttogo',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    console.log('inputs', inputs);
    const { timeout = 10000 } = parameters;
    let { url, zipcode, storeId, StoreID } = inputs;
    if(!url.match(/https:\/\/www.walmart.com\/grocery\/v3\/api/)) {
      storeId = StoreID || storeId || '5334';
      zipcode = zipcode || '';
      const id = url.match(/[^\/]+$/)[0];
      url = `https://www.walmart.com/grocery/v3/api/products/${id}?itemFields=all&nutritionPrescriptive=true` + `&storeId=${storeId}#zipcode=${zipcode}`;
    }
    const memory = {};
    const backconnect = !!memory.backconnect;
    const benchmark = !!memory.benchmark;
    const MAX_CAPTCHAS = 3;
    let captchas = 0;

    await context.setBlockAds(false);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(true);
    await context.setUseRelayProxy(true);

    // const captchaFrame = 'div.g-recaptcha iframe';
    // const captchaToken = '#recaptcha-token';
    const captchaSelector = 'div.re-captcha';

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
        context.waitForSelector('span[data-automation-id="zero-results-message"], .g-recaptcha, div[id="product-overview"]'),
        new Promise((resolve, reject) => setTimeout(reject, 2e4)),
      ]);

      console.log('Captcha vanished');
    };

    const solveCaptchaIfNecessary = async (responseData) => {
      console.log('Checking for CAPTCHA');
      while (await isCaptcha() && captchas < MAX_CAPTCHAS) {
        if (backconnect) throw Error('CAPTCHA received');

        console.log('Solving a captcha, captcha start time:', new Date());

        await solveCaptcha();
        captchas += 1;
        console.log('captcha end time:', new Date());
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      if (await isCaptcha()) {
        if (!benchmark) {
          // we failed to solve the CAPTCHA
          console.log('We failed to solve the CAPTCHA');
          return context.reportBlocked(responseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
        }
        return false;
      }
      return true;
    };

    const lastResponseData = await context.goto(url, {
      firstRequestTimeout: 40000,
      timeout,
      waitUntil: 'load',
      checkBlocked: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });

    await solveCaptchaIfNecessary(lastResponseData);
  },
};
