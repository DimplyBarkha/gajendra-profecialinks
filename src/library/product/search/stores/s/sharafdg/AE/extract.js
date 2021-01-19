const { transform } = require('../format.js');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'sharafdg',
    transform,
    domain: 'sharafdg.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let count = document.querySelectorAll('div.product-items  div.reset-padding').length;
        let currScroll = document.documentElement.scrollTop;
        while (count < 150) {
          const oldScroll = currScroll;
          window.scrollBy(0, 1000);
          await new Promise(resolve => setTimeout(resolve, 4000));
          currScroll = document.documentElement.scrollTop;
          count = document.querySelectorAll('div.product-items  div.reset-padding').length;
          if (oldScroll === currScroll) {
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
