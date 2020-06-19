
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
    let captchas = 0;
    let hasCaptcha = false;
    let lastResponseData;
    // eslint-disable-next-line
    // const js_enabled = true; // Math.random() > 0.7;
    // console.log('js_enabled', js_enabled); ;


    const run = async () => {
      // do we perhaps want to go to the homepage for amazon first?
      lastResponseData = await context.goto(url, {
        timeout: 20000,
        waitUntil: 'load',
        checkBlocked: false,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
    };

    
      await run();
 
  },
};
