
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'walmart.ca',
    timeout: 1000000,
    country: 'CA',
    store: 'walmart',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameterValues, context, dependencies) => {
    const timeout = parameterValues.timeout ? parameterValues.timeout : 10000;

    context.setBlockAds(false);
    context.setLoadAllResources(true);
    context.setAntiFingerprint(false);
    await context.setJavaScriptEnabled(true);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;

    // await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true});
    await context.goto(url, {
      firstRequestTimeout: 1000000,
      timeout,
      waitUntil: 'networkidle0',
      checkBlocked: false,
    });
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
