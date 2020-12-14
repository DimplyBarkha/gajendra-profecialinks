module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediamarkt.de',
    timeout: 30000,
    country: 'DE',
    store: 'mediamarkt',
    zipcode: "''",
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = inputs.url;

    await context.goto(url, {
      timeout: 30000,
      waitUntil: 'load',
      checkBlocked: true,
    });
    const navigation = async function (context, inputs) {
      let url = inputs.url;

      async function checkUrlForCategoryOrBrand () {
        return await context.evaluate(function () {
          const currentUrl = document.location.href;
          if (currentUrl.includes('shop/marke/') || currentUrl.includes('de/category/')) {
            return true;
          }
          return false;
        });
      }

      const categoryOrBrandInUrl = await checkUrlForCategoryOrBrand();

      if (categoryOrBrandInUrl) {
        const searchTerm = url.match(/(?<=query=).*?(?=&page|$)/)[0];
        url = url.replace(searchTerm, `%27${searchTerm}%27`);
        await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      }
    };
    await navigation(context, inputs);
    await context.setBlockAds(false);

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
          return context.reportBlocked('Blocked: Could not solve CAPTCHA, attempts=' + captchas);
        }
        return false;
      }
      return true;
    };
    await solveCaptchaIfNecessary();
  },
};
