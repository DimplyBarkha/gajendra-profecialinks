
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmart.com',
    country: 'US',
    store: 'walmart',
    timeout: 20000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 20000;
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, js_enabled: true, css_enabled: false, random_move_mouse: true });

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

    const isCaptcha = async () => {
      return await context.evaluate(async function () {
        const captchaEl = document.evaluate('div.g-recaptcha', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (captchaEl.snapshotLength) {
          return 'true';
        } else {
          return 'false';
        }
      });
    };

    const solveCaptcha = async () => {
      console.log('isCaptcha', true);
      await context.goto('https://www.google.com/recaptcha/api2/demo');
      await context.solveCaptcha({
        type: 'RECAPTCHA',
        inputElement: 'g-recaptcha',
      });
      await new Promise(r => setTimeout(r, 5000));
      await context.click({
        constructor: 'MouseEvent',
        target: {
          cssSelector: 'span#recaptcha-anchor',
        },
        typeArg: 'click',
        eventInit: {
          bubbles: true,
          cancelable: true,
          detail: 1,
          screenX: 90,
          screenY: 429,
          clientX: 82,
          clientY: 151,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
          metaKey: false,
          button: 0,
          buttons: 0,
          relatedTarget: null,
        },
      });
      await context.waitForNavigation();
      console.log('Captcha vanished');
      // const html = context.getHtml();

      // return html.includes('Verification Success... Hooray!');

      // await context.solveCaptcha({
      //   type: 'IMAGECAPTCHA',
      //   inputElement: 'form input[type=text][name]',
      //   imageElement: 'form img',
      //   autoSubmit: true,
      // });
      // console.log('solved captcha, waiting for page change');
      // context.waitForNavigation();
      // console.log('Captcha vanished');
    };

    const solveCaptchaIfNecessary = async () => {
      console.log('Checking for CAPTCHA');
      while (await isCaptcha() === 'true' && captchas < MAX_CAPTCHAS) {
        captchas++;
        await context.waitForSelector('iframe[role="presentation"]', { timeout: 30000 });
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
      // do we perhaps want to go to the homepage for amazon first?
      // lastResponseData = await context.goto(url, {
      //   timeout: 10000,
      //   waitUntil: 'load',
      //   checkBlocked: true,
      //   js_enabled: true,
      //   css_enabled: false,
      //   random_move_mouse: true,
      // });

      context.waitForNavigation();
      if (!await solveCaptchaIfNecessary()) {
        hasCaptcha = true;
        return;
      }

      // console.log('Go to some random page');
      // const clickedOK = await context.evaluate(async function () { //* [contains(@id,'contextualIngressPtLabel_deliveryShortLine')]/spa
      //   const randomLinkEls = document.evaluate("a[href*='/dp/']", document, null, XPathResult.ANY_TYPE, null);
      //   const randomLinkEl = randomLinkEls.iterateNext();
      //   if (randomLinkEl) {
      //     // @ts-ignore
      //     randomLinkEl.click();
      //     return 'true';
      //   } else {
      //     return 'false';
      //   }
      // });

      // if (clickedOK === 'false') {
      //   console.log('Could not click a product, aborting... :/');
      //   return;
      // } else {
      //   context.waitForNavigation();
      // }

      console.log('Going back to desired page');
      lastResponseData = await context.goto(url, {
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      console.log('lastResponseData', lastResponseData);

      // if (lastResponseData.status === 404 || lastResponseData.status === 410) {
      //   return;
      // }

      // if (lastResponseData.status !== 200) {
      //   console.log('Blocked: ' + lastResponseData.status);
      //   if (benchmark) {
      //     return;
      //   }
      //   if (backconnect) {
      //     throw Error('Bad response code: ' + lastResponseData.code);
      //   }
      //   return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
      // }

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

    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
