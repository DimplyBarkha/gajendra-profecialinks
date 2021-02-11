
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
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.setJavaScriptEnabled(true);
    // await context.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:85.0) Gecko/20100101 Firefox/85.0');

    await context.goto(url, {
      timeout: 15000,
      checkedBlocked: true,
      js_enabled: true,
      random_move_mouse: true,
      checkBlocked: false,
      antiCaptchaOptions: {
        provider: 'anti-captcha',
        type: 'RECAPTCHA',
        autoSubmit: true,
      }
    });


    const recaptchaPresent = await context.evaluate(() => {
      const recaptchaIframe = document.querySelector('div#recaptcha');
      return !!recaptchaIframe;
    });
    const iframeFound = await context.evaluate(() => {
      const iframe = document.querySelector('iframe');
      return !!iframe;
    });

    const captchaSolver = async () => {
      await context.solveCaptcha({ type: 'RECAPTCHA', inputElement: 'div#recaptcha' });
    };

    const currentUrl = async () =>{
       return await context.evaluate(()=> {
        return window.location.href
      });
    }

      if (recaptchaPresent) {
        console.log('Hit recaptcha, attempting to solve..');
        console.log(`iframe present: ${iframeFound}`)

        const maxAttempts = 3;
        let solved = false;
        let currentAttempts = 1;

        while (!solved && (currentAttempts < maxAttempts)) {
          console.log(`on attempt: ${currentAttempts}`);

          if (iframeFound){
            // @ts-ignore      // eslint-disable-next-line no-undef
            await context.evaluateInFrame('iframe', () => grecaptcha.execute())
          } else {
            await captchaSolver()
          }

            await new Promise((resolve,reject) => setTimeout(resolve, 5000));

            let thisUrl = await currentUrl();
            console.log(thisUrl)
            if(!(thisUrl.includes('sorry'))){
              console.log('Captcha solved, and redirected successfully!')
              solved= true;
            }

          // await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
          console.log(await currentUrl())
          await new Promise((resolve,reject) => setTimeout(resolve, 6000));

          currentAttempts++;
        }

      await context.checkBlocked()
        .catch((err) => {
          throw new Error(`Error:${err.message}, failed after ${currentAttempts - 1} attempts`);
        });
      console.log('Solved!');
    }
  },
};
