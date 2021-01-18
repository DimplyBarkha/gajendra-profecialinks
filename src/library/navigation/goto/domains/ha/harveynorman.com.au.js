
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'harveynorman.com.au',
    timeout: 500000,
    country: 'AU',
    store: 'harveynorman',
    zipcode: "''",
  },

  /* ----- commented because data is not coming for some urls eg- "https://www.harveynorman.com.au/miele-g-4263-scvi-active-60cm-fully-integrated-dishwasher.html"---- */
  /* There is an issue with got which is causing timeout error from goto without. Need to fix it. */
  /* implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
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
  }, */
};
