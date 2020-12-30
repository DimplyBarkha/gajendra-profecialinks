
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'currys.co.uk',
    timeout: 30000,
    country: 'UK',
    store: 'currys',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setJavaScriptEnabled(true);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'networkidle0', block_ads: false, js_enabled: true });
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
