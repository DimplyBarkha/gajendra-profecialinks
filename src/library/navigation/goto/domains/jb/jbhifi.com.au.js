
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jbhifi.com.au',
    timeout: 500000,
    country: 'AU',
    store: 'jbhifi',
    zipcode: "''",
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":60000,"force200":true}[/!opt!]`;
    context.setBlockAds(false);
    context.setLoadAllResources(true);
    context.setAntiFingerprint(false);
    await context.goto(url, { load_timeout: 0, firstRequestTimeout: 60000, timeout: 500000, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true });
    async function autoScroll(page) {
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
