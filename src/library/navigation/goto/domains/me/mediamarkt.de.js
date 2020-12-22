
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediamarkt.de',
    timeout: 35000,
    country: 'DE',
    store: 'mediamarkt',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    const lastResponseData = await context.goto(url, {
      timeout: 100000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
      anti_fingerprint: true,
      discard_CSP_header: false,
    });

    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    const MAX_CAPTCHAS = 3;
    let captchas = 0;

    const isCaptcha = async () => {
      return await context.evaluate(async function () {
        const captchaEl = document.evaluate("//div[contains(@id,'hcaptcha_widget')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
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
          console.log('We failed to solve the CAPTCHA');
          return context.reportBlocked(lastResponseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
        }
        return false;
      }
      return true;
    };
    await solveCaptchaIfNecessary();
  },
};
