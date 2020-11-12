const { transform } = require('../format.js');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'decathlon',
    transform: transform,
    domain: 'decathlon.fr',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const moreButton = document.evaluate('//div[@class="more-content"]//button[@id="more_product_a" and not(contains(@style,"display: none;"))]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (moreButton != null) {
        while (document.evaluate('//div[@class="more-content"]//button[@id="more_product_a" and not(contains(@style,"display: none;"))]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          moreButton.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          let scrollTop = 0;
          while (scrollTop !== 5000) {
            await stall(500);
            scrollTop += 1000;
            window.scroll(0, scrollTop);
            if (scrollTop === 5000) {
              await stall(500);
              break;
            }
          }
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
