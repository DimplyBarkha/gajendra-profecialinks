
module.exports = {

  implements: 'navigation/goto',

  parameterValues: {
    domain: 'grocery.walmart.com',
    country: 'US',
    store: 'walmartOG',
  },

  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false);

    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    console.log('benchmark', benchmark);
    const start = Date.now();
    const MAX_CAPTCHAS = 3;

    // let pageId;
    let captchas = 0;
    let hasCaptcha = false;
    let lastResponseData;

    const isCaptcha = async function () {
      return await context.evaluate(async function () {
        return document.querySelector('div.g-recaptcha') ? 'true' : 'false';
      });
    };

    const solveCaptcha = async function () {
      console.log('isCaptcha', true);
      await context.solveCaptcha({
        type: 'RECAPTCHA',
        inputElement: '.g-recaptcha',
        autoSubmit: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await context.waitForNavigation();
      console.log('Captcha vanished');
    };

    const solveCaptchaIfNecessary = async function () {
      console.log('Checking for CAPTCHA');
      await new Promise((resolve) => setTimeout(resolve, 10000));
      while (await isCaptcha() === 'true' && captchas < MAX_CAPTCHAS) {
        captchas++;
        await context.waitForSelector('iframe[role="presentation"]', { timeout: 120000 });
        if (backconnect) {
          throw Error('CAPTCHA received');
        }
        console.log('Solving a captcha', await isCaptcha(), captchas);
        await solveCaptcha();
      }
      if (await isCaptcha() === 'true') {
        if (!benchmark) {
          // we failed to solve the CAPTCHA
          console.log('We failed to solve the CAPTCHA');
          return context.reportBlocked(lastResponseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
        }
        return false;
      }
      return true;
    };

    const run = async function () {
      // do we perhaps want to go to the homepage for amazon first?
      lastResponseData = await context.goto('https://www.walmart.com/grocery', {
        timeout: 180000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
        block_ads: false,
      });

      await context.waitForNavigation();
      if (!await solveCaptchaIfNecessary()) {
        hasCaptcha = true;
        return;
      }

      console.log('Going back to desired page');
      lastResponseData = await context.goto(url, {
        timeout: 180000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
        block_ads: false,
      });
      console.log('lastResponseData', lastResponseData);

      if (!await solveCaptchaIfNecessary) {
        hasCaptcha = true;
      }
    };

    try {
      await run();
    } finally {
      await context.evaluate((captchaCount, duration, js, hasCaptcha) => {
        const captchasElt = document.createElement('meta');
        captchasElt.name = 'captchas';
        captchasElt.content = captchaCount;
        document.head.appendChild(captchasElt);
        const hasCaptchaElt = document.createElement('meta');
        hasCaptchaElt.name = 'hasCaptcha';
        hasCaptchaElt.content = hasCaptcha;
        document.head.appendChild(hasCaptchaElt);
        const timeElt = document.createElement('meta');
        timeElt.name = 'durationmillis';
        timeElt.content = duration;
        document.head.appendChild(timeElt);
        const javascriptElt = document.createElement('meta');
        javascriptElt.name = 'javascript';
        javascriptElt.content = js;
        document.head.appendChild(javascriptElt);
        // js_enabled
      }, [captchas, Date.now() - start, hasCaptcha]);
    }

    if (zipcode) {
      await dependencies.setZipCode({ zipcode: zipcode });
    }
    await context.goto(url, { timeout: 180000, waitUntil: 'load', checkBlocked: false, block_ads: false, js_enabled: true, css_enabled: false, random_move_mouse: true });
  },
};
