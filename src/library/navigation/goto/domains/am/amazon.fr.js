
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'amazon.fr',
    timeout: null,
    country: 'FR',
    store: 'amazonMsReviews',
    zipcode: '',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    console.log('benchmark', benchmark);
    const MAX_CAPTCHAS = 3;

    let captchas = 0;
    // let hasCaptcha = false;
    let lastResponseData;

    const isCaptcha = async () => {
      return await context.evaluate(async function () {
        const captchaEl = document.evaluate("//img[contains(@src,'/captcha/')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
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
        type: 'IMAGECAPTCHA',
        inputElement: 'form input[type=text][name]',
        imageElement: 'form img',
        autoSubmit: true,
      });
      await Promise.all([
        console.log('solved captcha, waiting for page change'),
        context.waitForNavigation(),
        await new Promise(resolve => setTimeout(resolve, 3000)),
      ]);
      console.log('Captcha vanished');
    };

    const solveCaptchaIfNecessary = async () => {
      console.log('Checking for CAPTCHA', await isCaptcha());
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
        return 'false';
      }
      return 'true';
    };
    const run = async () => {
      // do we perhaps want to go to the homepage for amazon first?
      lastResponseData = await context.goto(url, {
        timeout: 10000,
        waitUntil: 'load',
        checkBlocked: false,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (lastResponseData.status === 404 || lastResponseData.status === 410) {
        return;
      }

      if (lastResponseData.status === 503) {
        await Promise.all([
          console.log('Waiting for page to reload on homepage'),
          context.waitForNavigation(),
          console.log('Clicking 503 image'),
          await context.click('a img[src*="503.png"], a[href*="ref=cs_503_link"]'),
        ]);

        if (await solveCaptchaIfNecessary() === 'false') {
          // hasCaptcha = true;
          return;
        }

        console.log('Go to some random page');
        const clickedOK = await context.evaluate(async function () { //* [contains(@id,'contextualIngressPtLabel_deliveryShortLine')]/spa
          const randomLinkEls = document.evaluate("a[href*='/dp/']", document, null, XPathResult.ANY_TYPE, null);
          const randomLinkEl = randomLinkEls.iterateNext();
          if (randomLinkEl) {
            // @ts-ignore
            randomLinkEl.click();
            return 'true';
          } else {
            return 'false';
          }
        });

        if (clickedOK === 'false') {
          console.log('Could not click a product, aborting... :/');
          return;
        } else {
          context.waitForNavigation();
        }

        console.log('Going back to desired page');
        lastResponseData = await context.goto(url, {
          timeout: 10000,
          waitUntil: 'load',
          checkBlocked: false,
          js_enabled: true,
          css_enabled: false,
          random_move_mouse: true,
        });
        console.log('lastResponseData', lastResponseData);
        await new Promise(resolve => setTimeout(resolve, 1000));
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

      if (await solveCaptchaIfNecessary() === 'false') {
        // hasCaptcha = true;
        return;
      }

      if (lastResponseData.status === 404 || lastResponseData.status === 410) {
        return;
      }

      const wrongLocale = await context.evaluate(async function () {
        const locationWarningPopupEl = document.evaluate("//div[contains(@id, 'glow-toaster-body') and not(//*[contains(text(), 'Amazon Fresh')])]/following-sibling::div[@class='glow-toaster-footer']//input[@data-action-type='SELECT_LOCATION']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (locationWarningPopupEl.snapshotLength > 0) {
          return 'true';
        } else {
          return 'false';
        }
      });

      if (await wrongLocale === 'true' && !benchmark) {
        console.log('wrongLocale', !benchmark, wrongLocale);
        console.log('Incorrect locale detected');
        if (backconnect) {
          throw new Error('Incorrect locale detected');
        }
        throw new Error('Incorrect locale detected');
      }
    };

    await run();
  },
};
