module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'breuninger.de',
    timeout: 60000,
    country: 'DE',
    store: 'breuninger',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(100000);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    url = `${url}#[!opt!]{"block_ads":false, "force200": true}[/!opt!]`;
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false, force200: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
    async function autoScroll (page) {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }
    await autoScroll(context);
  },
};
