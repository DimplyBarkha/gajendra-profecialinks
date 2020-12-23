
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'abt.com',
    timeout: 20000,
    country: 'US',
    store: 'abt',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"first_request_timeout":60000, "block_ads": false}[/!opt!]`;
    await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', block_ads: false });
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
