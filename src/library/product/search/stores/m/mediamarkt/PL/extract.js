const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.pl',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;

    async function autoScroll (page) {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 1000;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight - 2000;
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
    await context.evaluate(() => {
      const searchUrl = window.location.href;
      const appendElements = document.querySelectorAll("a[class='b-ofr_headDataTitle']");
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('searchurl', searchUrl);
        });
      }
    });
    try {
      await context.waitForSelector('div[class="b-listing_toolBarPagination"] > nav > a[class*="pagination_next"] , a[class*="is-nextPage"]>i', { timeout: 5000 });
    } catch (error) {
      console.log(error);
    }
    return await context.extract(productDetails, { transform });
  },

};
