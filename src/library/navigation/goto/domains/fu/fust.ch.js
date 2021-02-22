
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fust.ch',
    timeout: 100000,
    country: 'CH',
    store: 'fust',
    zipcode: "''",
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60000,"load_timeout":60000,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'networkidle0', block_ads: false, timeout });
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
