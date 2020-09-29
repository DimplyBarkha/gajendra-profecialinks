
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.fr',
    timeout: 90000,
    country: 'FR',
    store: 'carrefour',
    zipcode: '',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    console.log('benchmark', benchmark);
    const start = Date.now();
    const MAX_CAPTCHAS = 3;
    // await context.setUseRelayProxy(false);

    // let pageId;
    let captchas = 0;
    let hasCaptcha = false;
    let lastResponseData;
    // eslint-disable-next-line
    // const js_enabled = true; // Math.random() > 0.7;
    // console.log('js_enabled', js_enabled); ;

    const isCaptcha = async () => {
      return await context.evaluate(async function () {
        const captchaEl = document.evaluate("//iframe')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (captchaEl.snapshotLength) {
          return 'true';
        } else {
          return 'false';
        }
      });
    };

    const solveCaptcha = async () => {
      console.log('isCaptcha', true);

      await context.solveCaptcha({
        type: 'RECAPTCHA',
      //  inputElement: 'form input[type=text][name]',
      //  imageElement: 'form img',
      //  autoSubmit: true,
      });
      console.log('solved captcha, waiting for page change');
      context.waitForNavigation();
      console.log('Captcha vanished');
    };

    const solveCaptchaIfNecessary = async () => {
      console.log('Checking for CAPTCHA');
      while (await isCaptcha() === 'true' && captchas < MAX_CAPTCHAS) {
        captchas++;
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
    const run = async () => {
      await context.setUseRelayProxy(false);
      lastResponseData = await context.goto(url, {
        antiCaptchaOptions: {
          type: 'RECAPTCHA',
        },
        timeout: 10000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        //  css_enabled: false,
        random_move_mouse: true,
      });

      if (lastResponseData.status === 404 || lastResponseData.status === 410) {
        return;
      }

      if (lastResponseData.status === 503) {
        console.log('Clicking 503 image');
        await context.click('a img[src*="503.png"], a[href*="ref=cs_503_link"]');

        console.log('Waiting for page to reload on homepage');
        context.waitForNavigation();
        if (!await solveCaptchaIfNecessary()) {
          hasCaptcha = true;
          return;
        }

        console.log('Going back to desired page');
        await context.setUseRelayProxy(false);
        lastResponseData = await context.goto(url, {
          antiCaptchaOptions: {
            type: 'RECAPTCHA',
          },
          timeout: 10000,
          waitUntil: 'load',
          checkBlocked: true,
          js_enabled: true,
          //      css_enabled: false,
          random_move_mouse: true,
        });
        console.log('lastResponseData', lastResponseData);
        // @ts-ignore
        await context.evaluateInFrame('iframe', ()=> grecaptcha.execute())
      }

      if (lastResponseData.status === 404 || lastResponseData.status === 410) {
        return;
      }

      if (lastResponseData.status !== 200) {
        console.log('Blocked: ' + lastResponseData.status);
        if (benchmark) {
          return;
        }
        if (backconnect) {
          throw Error('Bad response code: ' + lastResponseData.code);
        }
        return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
      }

      if (!await solveCaptchaIfNecessary) {
        hasCaptcha = true;
        return;
      }

      if (lastResponseData.status === 404 || lastResponseData.status === 410) {

      }
    };

    try {
      await run();
    } finally {
    // needs to be non-fat arrow
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
  },
};
