module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'alza.cz',
    timeout: 30000,
    country: 'CZ',
    store: 'alza',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    try {
      await context.waitForSelector('.g-recaptcha');
      for (let i = 0; i < 4; i++) {
        const isCaptcha = await context.evaluate(() => {
          return Boolean(document.querySelector('.g-recaptcha'));
        });
        if (isCaptcha) {
          await context.waitForNavigation({ timeout });
          // @ts-ignore
          // eslint-disable-next-line no-undef
          // await context.evaluate(() => grecaptcha.execute());
          await context.solveCaptcha({
            type: 'RECAPTCHA',
            inputElement: '.captcha-handler',
            autoSubmit: true,
          });
          console.log('solved captcha, waiting for page change');
          await context.click('#form #button');
          await context.waitForNavigation({ timeout });
        }
      }
      const status = await context.evaluate(() => {
        return document.querySelector('.captcha-handler').getAttribute('captchastatus');
      });
      if (status === 'fail') {
        await context.evaluate(() => {
          window.location.reload();
        });
        await context.waitForNavigation({ timeout });
        // @ts-ignore
        // eslint-disable-next-line no-undef
        // await context.evaluate(() => grecaptcha.execute());
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: '.captcha-handler',
          autoSubmit: true,
        });
        console.log('solved captcha, waiting for page change');
        await context.click('#form #button');
        await context.waitForNavigation({ timeout });
      }
    } catch (e) {
      console.log(e.message);
    }
  },
};
