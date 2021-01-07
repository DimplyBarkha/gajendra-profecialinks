module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'pokupki.market.yandex.ru',
    timeout: 20000,
    country: 'RU',
    store: 'beru',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode },
    parameters,
    context,
    dependencies
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    // await context.setBypassCSP(true);
    // await context.setCssEnabled(true);
    // await context.setAntiFingerprint(false);
    // await context.setJavaScriptEnabled(true);
    // await context.setBlockAds(false);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // const inputUrl = `${url}#[!opt!]{"discard_CSP_header":true, "block_ads": false}[/!opt!]`;
    // await context.goto(inputUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
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
    // eslint-disable-next-line
    // const js_enabled = true; // Math.random() > 0.7;
    // console.log('js_enabled', js_enabled); ;

    const isCaptcha = async () => {
      return await context.evaluate(async function () {
        const captchaEl = document.evaluate(
          '//div[contains(@class, "captcha__image")]//img',
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
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
        inputElement: 'form input[name="rep"]',
        imageElement: 'form img',
        autoSubmit: true,
      });
      console.log('solved captcha, waiting for page change');
      context.waitForNavigation();
      console.log('Captcha vanished');
    };

    const solveCaptchaIfNecessary = async () => {
      console.log('Checking for CAPTCHA');
      while ((await isCaptcha()) === 'true' && captchas < MAX_CAPTCHAS) {
        captchas++;
        if (backconnect) {
          throw Error('CAPTCHA received');
        }
        console.log('Solving a captcha', await isCaptcha(), captchas);
        await solveCaptcha();
      }
      if ((await isCaptcha()) === 'true') {
        if (!benchmark) {
          // we failed to solve the CAPTCHA
          console.log('We failed to solve the CAPTCHA');
          return context.reportBlocked(
            lastResponseData.code,
            'Blocked: Could not solve CAPTCHA, attempts=' + captchas
          );
        }
        return false;
      }
      return true;
    };
    const run = async () => {
      // do we perhaps want to go to the homepage for amazon first?
      lastResponseData = await context.goto(url, {
        timeout: 60000,
        waitUntil: 'load',
        checkBlocked: false,
      });

      if (lastResponseData.status === 403) {
        return context.reportBlocked(
          lastResponseData.status,
          'Blocked: ' + lastResponseData.status
        );
      }

      await solveCaptchaIfNecessary();

      // if (!await solveCaptchaIfNecessary) {
      //   hasCaptcha = true;
      //   return;
      // }
    };

    await run();
  },
};
