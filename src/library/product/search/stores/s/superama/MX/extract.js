const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'superama',
    transform: transform,
    domain: 'superama.com.mx',
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
      
      let scrollTop = 0;
      while (scrollTop !== 10000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 10000) {
          await stall(500);
          break;
        }
      }
      const moreButton = document.evaluate('//button[@class="btnSuperama btnSuperama-blanco"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (moreButton && moreButton.singleNodeValue != null) {
        let index = 0
          while (index < 3) {
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          try{
            moreButton.singleNodeValue.click();
          }catch(e) {}
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          let scrollTop = 0;
          index ++;
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
