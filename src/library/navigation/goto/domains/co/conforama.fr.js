
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
      // await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
      await context.goto(url,  {
        timeout: 50000, waitUntil: 'load', checkBlocked: true,
        antiCaptchaOptions: {
        type: 'RECAPTCHA',
        },
        // proxy: {
        //   use_relay_proxy: false
        // },
        });
        try {
          let acceptCookie = await context.waitForSelector('button#footer_tc_privacy_button');
          if(acceptCookie){
            await context.click('button#footer_tc_privacy_button');
          }
          await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        } catch (error) {
          
        }
  }
};
