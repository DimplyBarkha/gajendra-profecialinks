
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'cvs.com',
    country: 'US',
    store: 'cvs',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    console.log('benchmark', benchmark);
    const start = Date.now();
    const MAX_CAPTCHAS = 3;

    // let pageId;
    const captchas = 0;
    // let hasCaptcha = false;
    let lastResponseData;
    // eslint-disable-next-line
    // const js_enabled = true; // Math.random() > 0.7;
    // console.log('js_enabled', js_enabled); ;

    const run = async () => {
      // do we perhaps want to go to the homepage for amazon first?
      lastResponseData = await context.goto(url, {
        timeout: 25000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      // context.waitForNavigation()

      // if (lastResponseData.status === 503 || lastResponseData.status === 502 || lastResponseData.status === 410 || lastResponseData.status === 404 || lastResponseData.status === 456 || lastResponseData.status === 405) {
      //   let hasCaptcha = await context.evaluate(function() {
      //     let element = document.querySelector("div.container-fluid h1");
      //     if( element != null && element.textContent == "Oops! Something went wrong") {
      //       return true;
      //     }
      //     return false;
      //   });

      //   if( hasCaptcha ) {
      //     console.log('resolveCaptcha!!!!!!!!!!!!!!!!!!!!!!!!!!!!!????????????????????????????????');

      //     await context.solveCaptcha({
      //         type: 'RECAPTCHA',
      //         inputElement: '.g-recaptcha',
      //     }).catch();
      //     context.waitForNavigation();
      //   }
      //   if (lastResponseData.status !== 200) {
      //     console.log('Blocked: ' + lastResponseData.status);

      //     return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
      //   }
      // }
    };

    await run();
  },
};
