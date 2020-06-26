module.exports = {
  parameterValues: {
    domain: 'lowes.com',
    country: 'US',
    store: 'lowes',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  },
};
