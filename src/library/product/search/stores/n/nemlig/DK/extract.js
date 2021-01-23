const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'nemlig',
    transform,
    domain: 'nemlig.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        const recordSelector = 'div#searchscrollable div.searchresult__item-container productlist-item';
        let count = document.querySelectorAll(recordSelector).length;
        while (count < 150) {
          const oldCount = count;
          document.querySelector('div.searchresult__loadmore_container:not(.ng-hide) button.btn.searchresult__loadmore_button') && document.querySelector('div.searchresult__loadmore_container:not(.ng-hide) button.btn.searchresult__loadmore_button').click();
          await new Promise((resolve, reject) => setTimeout(resolve, 3000));
          count = document.querySelectorAll(recordSelector).length;
          if (oldCount === count) {
            break;
          }
        }
      });
    };
    await applyScroll(context);

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
