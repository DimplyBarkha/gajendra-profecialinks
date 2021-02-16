
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'shop.rewe.de',
    timeout: 60000,
    country: 'DE',
    store: 'rewe',
    zipcode: '',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
      const isCaptcha = async () => {
      return await context.evaluate(async function () {
        const captchaEl = document.evaluate('//div[@class="captcha-box"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (captchaEl.snapshotLength) {
          return true;
        } else {
          return false;
        }
      });
    };

    if (isCaptcha()) {
      console.log('isCaptcha', true);

      await context.solveCaptcha({
        type: 'HCAPTCHA',
        inputElement: `#challenge-form > input[name='r']`,
        autoSubmit: true,
      });
      console.log('solved captcha, waiting for page change');
      context.waitForNavigation();
      console.log('Captcha vanished');
    }
  },
  // implementation: async ({ url }, parameterValues, context, dependencies) => {
  //   // eslint-disable-next-line
  //   // const js_enabled = true; // Math.random() > 0.7;
  //   // console.log('js_enabled', js_enabled); ;

  //   const isCaptcha = async () => {
  //     return await context.evaluate(async function () {
  //       const captchaEl = document.evaluate('//div[@id="cf-hcaptcha-container"]//iframe', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  //       if (captchaEl.snapshotLength) {
  //         return 'true';
  //       } else {
  //         return 'false';
  //       }
  //     });
  //   };
  //   try {
  //     if (isCaptcha) {
  //       document.querySelector('div[id="cf-hcaptcha-container"] iframe').click();
  //     }
  //   } catch (err) {
  //     console.group('Captcha not solved' + err);
  //   }
  // },
};
