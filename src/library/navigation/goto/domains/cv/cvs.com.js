
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

    const run = async () => {
      // do we perhaps want to go to the homepage for amazon first?
      await context.goto(url, {
        timeout: 25000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
    };

    await run();
  },
};
