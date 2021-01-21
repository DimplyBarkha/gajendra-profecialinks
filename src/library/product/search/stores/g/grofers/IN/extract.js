const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'grofers',
    transform,
    domain: 'grofers.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        const recordSelector = 'div.products  div.plp-product';
        let count = document.querySelectorAll(recordSelector).length;
        let currScroll = document.documentElement.scrollTop;
        while (count < 150) {
          const oldScroll = currScroll;
          window.scrollBy(0, 500);
          await new Promise((resolve, reject) => setTimeout(resolve, 3000));
          currScroll = document.documentElement.scrollTop;
          count = document.querySelectorAll(recordSelector).length;
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
