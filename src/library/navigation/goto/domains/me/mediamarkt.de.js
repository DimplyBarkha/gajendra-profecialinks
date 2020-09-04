
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
    // url = `${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60000,"force200":true,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]`;
    // await context.goto(url, {
    //   block_ads: false,
    //   load_all_resources: true,
    //   images_enabled: true,
    //   timeout: 35000,
    //   waitUntil: 'load',
    // });
    await context.setBlockAds(false);
    let lastResponseData;

    lastResponseData = await context.goto(url, {
      timeout: 100000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
      anti_fingerprint: true,
      discard_CSP_header: false,
    });
    // await context.goto(`${url}`, {
    //   anti_fingerprint: true,
    //   discard_CSP_header: false,
    //   timeout: 100000,
    //   waitUntil: 'load',
    // });
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
        // inputElement: 'form input[type=text][name]',
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
  },
};
