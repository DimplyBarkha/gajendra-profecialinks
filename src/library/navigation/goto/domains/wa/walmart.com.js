module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmart.com',
    country: 'US',
    store: 'walmart',
    timeout: 20000,
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    if (storeId) {
      const datetime = new Date().getTime();
      url = `${url}#[!opt!]{"storage":{},"cookie_jar":[{"name":"t-loc-psid","value":"${datetime}|${storeId}"}]}[/!opt!]`;
    }
    console.log(url);
    console.log('###############################################');
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 50000,
      waitUntil: 'networkidle0',
    });

    await context.waitForNavigation();
    const solveCaptcha = async () => {
      console.log('..solveReCaptcha..');
      await context.solveCaptcha({
        type: 'RECAPTCHA',
        inputElement: '.g-recaptcha',
      });

      // await new Promise(r => setTimeout(r, 20000));
      console.log('..end solveReCaptcha..');
    };

    const solveCaptchaIfNecessary = async () => {
      const isCaptcha = await context.evaluate(() => !!document.querySelector('.g-recaptcha'));
      if (isCaptcha) {
        await solveCaptcha();
      }
    };
    await solveCaptchaIfNecessary();
    await context.waitForNavigation();
  },
};
