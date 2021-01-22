const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'whiskyzone',
    transform,
    domain: 'whiskyzone.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        const recordSelector = 'div.product--box';
        let count = document.querySelectorAll(recordSelector).length;
        let currScroll = document.documentElement.scrollTop;
        while (count < 150) {
          const oldScroll = currScroll;
          document.querySelector('a.js--load-more') && document.querySelector('a.js--load-more').click();
          window.scrollBy(0, 1000);
          await new Promise((resolve, reject) => setTimeout(resolve, 500));
          window.scrollBy(0, 500);
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
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
