const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CZ',
    store: 'alza',
    transform,
    domain: 'alza.cz',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      let rpc = await context.evaluate(() => {
        return window.location.href.split('=')[1];
      });
      rpc = rpc.split('&')[0];
      await context.waitForSelector(`div[data-code="${rpc}"] a`, { timeout: 40000 });
      let url = await context.evaluate((rpc) => {
        return (document.querySelector(`div[data-code="${rpc}"] a`).getAttribute('href'));
      }, rpc);
      url = 'https://www.alza.cz/' + url;
      const timeout = 50000;
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
      await context.waitForNavigation();
    } catch (e) {
      console.log('No such product exists');
    }
    // try {
    //   await context.evaluate(() => {
    //     document.querySelector('#cpcm_cpc_mediaDescription').scrollIntoView({behavior: "smooth"})
    //   })
    //   await context.waitForXPath('//div[@id="celek"]//img', {timeout: 50000})
    // } catch (e) {
    //   console.log(e.message);
    // }

    return await context.extract(productDetails, { transform });
  },
};
