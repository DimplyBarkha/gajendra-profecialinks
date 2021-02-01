
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ubaldi.com',
    timeout: 50000,
    country: 'FR',
    store: 'ubaldi',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'networkidle0',
      checkBlocked: false,
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      load_timeout: 0,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });try{
      // @ts-ignore
      await context.evaluateInFrame('iframe', () => grecaptcha.execute());
        console.log('solved captcha, waiting for page change');
        await context.waitForNavigation({ timeout });
    }catch(e){
      console.log('Captcha not found');
    }
  },
};
