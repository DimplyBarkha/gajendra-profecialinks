
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

    await context.goto(url, {
      timeout: 15000,
      checkBlocked: false,
      js_enabled: true,
      random_move_mouse: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA'
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

    const captchaSolved = async () =>{
      return await context.evaluate(() => {
        return !!document.querySelector('div[captchastatus=ok]');
      })
    }

    if (recaptchaPresent) {
      console.log('Hit recaptcha, attempting to solve..');
      console.log(`iframe present: ${iframeFound}`)
      
      const maxAttempts = 3;
      let solved = false;
      let currentAttempts = 1;
      
      while (!solved && (currentAttempts < maxAttempts)) {
        console.log(`on attempt: ${currentAttempts}`);
        // Removed click, resolve captcha w/ solveCaptcha instead
        // await context.click('div.captcha-handler',{ timeout: 4000 })
        // .then(async()=>await new Promise(res=>setTimeout(res,2000)))
        // .catch(()=>console.log('No click required'));
        
        if (iframeFound){
          // @ts-ignore      // eslint-disable-next-line no-undef  
          await context.evaluateInFrame('iframe', () => grecaptcha.execute())
        } else {
          await captchaSolver()
        }
        if (await captchaSolved()){
          console.log('Captcha solved! Submitting form..')
          await context.evaluate(()=>{
            document.getElementById('captcha-form').submit();
          });
          await new Promise((resolve,reject) => setTimeout(resolve, 5000));
          let captchaGone = await context.evaluate(()=>{
            return !!document.querySelector('div#recaptcha');
          })

          console.log(`Is captcha really gone? ${captchaGone}`)
          let thisUrl = await currentUrl();
          console.log(thisUrl)
          if(captchaGone && !(thisUrl.includes('sorry'))){
            solved= true;
          }
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
