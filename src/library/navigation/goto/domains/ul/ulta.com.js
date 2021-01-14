
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ulta.com',
    timeout: 80000,
    country: 'US',
    store: 'ulta',
    zipcode: '',
  },
  // implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
  //   const timeout = parameters.timeout ? parameters.timeout : 90000;
  //   await context.setBlockAds(false);
  //   await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, cookies: [] });
  //   console.log(zipcode);
  //   if (zipcode) {
  //     await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
  //   }
  // },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    let url = `${inputs.url}`;
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'networkidle0', block_ads: false });
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
