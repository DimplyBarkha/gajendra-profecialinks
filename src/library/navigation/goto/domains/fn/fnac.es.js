
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fnac.es',
    timeout: 60000,
    country: 'ES',
    store: 'fnac',
    zipcode: '',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    const timeout = parameterValues.timeout ? parameterValues.timeout : 60000;
    await context.setBlockAds(false);
    let lastResponseData = await context.goto(url,
      {
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: false,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      },
    );

    try {
      await context.waitForSelector('span.geetest_radar_tip_content', { timeout: 45000 });
    } catch (error) {
      console.log('No verification needed.');
    }

    // const verifyAccess = await context.evaluate(function () {
    //   return Boolean(document.querySelector('span.geetest_radar_tip_content'));
    // });

    // if (verifyAccess) {
    //   await context.evaluate(function () {
    //     document.querySelector('span.geetest_radar_tip_content').click();
    //   });
    // }

    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    const MAX_CAPTCHAS = 3;
    let captchas = 0;

    const isCaptcha = async () => {
      return await context.evaluate(async function () {
        const captchaEl = document.evaluate("//div[contains(@id,'captcha-container')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
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
        imageElement: 'div.image',
        autoSubmit: true,
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
    await solveCaptchaIfNecessary();

    lastResponseData = await context.goto(url, {
      timeout: 10000,
      waitUntil: 'load',
      checkBlocked: false,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    console.log('lastResponseData', lastResponseData);

    await context.waitForSelector('span.Header__logo-img', { timeout: 45000 });
  },
};
