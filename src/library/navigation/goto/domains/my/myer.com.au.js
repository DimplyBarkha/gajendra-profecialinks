
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'myer.com.au',
    // timeout: 9000000,
    timeout: 100000,
    country: 'AU',
    store: 'myer',
    zipcode: '',
  },
  // implementation: async (inputs, parameterValues, context, dependencies) => {
  //   let url = `${inputs.url}`;
  //   await context.setBlockAds(false);
  //   await context.setJavaScriptEnabled(true);
  //   //url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
  //   await context.goto(url, { waitUntil: 'networkidle0', block_ads: false, js_enabled: true });
  //   await context.evaluate(async function () {
  //     window.scrollTo(0,1000);

  //     });

  // },

  implementation: async (inputs, parameterValues, context, dependencies) => {
    let url = `${inputs.url}`;
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'networkidle0', block_ads: false });
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