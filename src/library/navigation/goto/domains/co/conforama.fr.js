
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'conforama.fr',
    timeout: 90000,
    country: 'FR',
    store: 'conforama',
    first_request_timeout: 90000,
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    console.log("BEFORE GOTO");
      await context.setAntiFingerprint(false);
      await context.setLoadAllResources(true);
      await context.setBlockAds(false);
      await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: false });
      const isCaptcha = async () => {
        return await context.evaluate(async function () {
        let captchaEl = document.querySelector('div.g-recaptcha');
        if(captchaEl){
         return captchaEl;
        }
        });
      };
      console.log('isCaptcha: ', await isCaptcha);
      await context.evaluateInFrame(isCaptcha, async function () {
        console.log('evaluateInFrame:');
        let captchaCheckBox = document.querySelector('div.g-recaptcha');
        if(captchaCheckBox){
          console.log('captchaCheckBox: ', captchaCheckBox);
         // @ts-ignore
         captchaCheckBox.click();
        }
      // @ts-ignore
      });
      await context.waitForNavigtion();
        try {
          let acceptCookie = await context.waitForSelector('button#footer_tc_privacy_button');
          if(acceptCookie){
            await context.click('button#footer_tc_privacy_button');
          }
          await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        } catch (error) {
          console.log('error: ', error);
        }
  }
};
