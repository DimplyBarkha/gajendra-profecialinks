
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'google.com',
    timeout: null,
    zipcode: '',
    country: 'US',
    store: 'google',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto(url, {
      timeout: 15000,
      checkBlocked: false,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    const recaptchaPresent = await context.evaluate(() => {
      const recaptchaIframe = document.querySelector('div#recaptcha');
      return !!recaptchaIframe;
    });

    const captchaSolver = async () => {
      await context.solveCaptcha({ type: 'RECAPTCHA', inputElement: 'div#recaptcha' });
    };

    const currentUrl = await context.evaluate(()=>{
      return window.location.href;
    })

    if (recaptchaPresent) {
      console.log('Hit recaptcha, attempting to solve..');
      const maxAttempts = 4;
      let solved = false;
      let currentAttempts = 1;

      while (!solved && (currentAttempts < maxAttempts)) {
        console.log(`on attempt: ${currentAttempts}`);
        await captchaSolver();
        await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
        console.log(currentUrl)
        await new Promise((resolve,reject) => setTimeout(resolve, 3000));
        if (!recaptchaPresent) {
          solved = true;
        }
        currentAttempts++;
      }

      await context.checkBlocked()
        .catch((err) => {
          throw new Error(`Error:${err.message}, failed after ${currentAttempts} attempts`);
        });
      console.log('Solved!');
    }
  },
};
