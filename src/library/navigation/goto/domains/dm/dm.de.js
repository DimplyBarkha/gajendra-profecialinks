
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dm.de',
    country: 'DE',
    store: 'dm',
    timeout: 100000,
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
   
    await context.setAntiFingerprint(false);
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    await context.setJavaScriptEnabled(true);
    const timeout = parameters.timeout ? parameters.timeout : 100000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
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
    console.log(zipcode);
  },
};
