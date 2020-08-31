
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'target.com.au',
    timeout: null,
    country: 'AU',
    store: 'target',
    zipcode: '',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    console.log('benchmark', benchmark);
    let lastResponseData;

    const run = async () => {
      lastResponseData = await context.goto(url, {
        timeout: 30000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
        block_ads: false,
        anti_fingerprint: true,
      });

      if (lastResponseData.status === 404 || lastResponseData.status === 403 || lastResponseData.status === 410) {
        return;
      }

      if (lastResponseData.status !== 200) {
        console.log('Blocked: ' + lastResponseData.status);
        if (benchmark) {
          return;
        }
        if (backconnect) {
          throw Error('Bad response code: ' + lastResponseData.code);
        }
        return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
      }
    };
    try {
      await run();
    } finally {
      console.log();
    }
  },
};
