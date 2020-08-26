
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.fr',
    timeout: 80000,
    country: 'FR',
    store: 'carrefour',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    console.log('benchmark', benchmark);
    const start = Date.now();
    const MAX_CAPTCHAS = 3;

    let pageId;
    let captchas = 0;
    let hasCaptcha = false;
    let lastResponseData;

    const js_enabled = true; //Math.random() > 0.7;
    console.log('js_enabled', js_enabled);
      const isCaptcha = async() => { return context.evaluate(function (xp) {
        const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        console.log(xp, r);
        const e = r.iterateNext();
        console.log(e);
        return !e;
      }, '//*[@class="g-recaptcha"]');
  }
    const solveCaptcha = async() => {
        console.log('isCaptcha', true);
    
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: '.g-recaptcha'
        }); 
        console.log('solved captcha, waiting for page change');
        context.waitForNavigation();            
        console.log('Captcha vanished');
    }
    const solveCaptchaIfNecessary = async() => {
        console.log('Checking for CAPTCHA');
        while (await isCaptcha() === 'true' && captchas < MAX_CAPTCHAS) {
          captchas++;
          if ( backconnect ) {
            throw Error('CAPTCHA received');
          }
          console.log('Solving a captcha', await isCaptcha(), captchas)
          await solveCaptcha();
        }
        if ( await isCaptcha() === 'true') {
          if ( ! benchmark ) {
            // we failed to solve the CAPTCHA
            console.log('We failed to solve the CAPTCHA');
            return context.reportBlocked(lastResponseData.status, 'Blocked: Could not solve CAPTCHA, attempts='+ captchas);
          }
          return false;
        }
        return true;
    }

    const run = async () => {

        // do we perhaps want to go to the homepage for amazon first?
        lastResponseData = await context.goto(url, { 
            js_enabled,
            css_enabled: false,
            random_move_mouse: true,
            timeout: 90000, waitUntil: 'load', checkBlocked: false, first_request_timeout: 80000
        });
    
        if (lastResponseData.status === 404 || lastResponseData.status === 410) {
          return;
        }
    
        console.log('lastResponseData', lastResponseData);
        console.log('isCaptcha', await isCaptcha())
          
        if (lastResponseData.status === 404 || lastResponseData.status === 410) {
            return;
        }
    
        if (lastResponseData.status !== 200) {
            if ( benchmark ) {
                return;
            }
            if ( backconnect ) {
                throw Error('Bad response code: '+lastResponseData.status);
            }
          return context.reportBlocked(lastResponseData.status, 'Blocked: '+lastResponseData.status );
        }
    
        if ( ! await solveCaptchaIfNecessary() ) {
            hasCaptcha = true;
            return;
        }
    
        if (lastResponseData.status === 404 || lastResponseData.status === 410) {
            return;
        }
    };
   
        await run();
}
};
