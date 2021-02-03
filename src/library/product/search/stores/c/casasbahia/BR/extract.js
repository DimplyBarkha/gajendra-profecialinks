const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'casasbahia',
    transform,
    domain: 'casasbahia.com.br',
    zipcode: "''",
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
      while (scrollTop !== 5000) {
        await stall(1000);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 5000) {
          await stall(500);
          break;
        }
      }
      // const moreButton = document.evaluate('//div[contains(@class,"LoadMore__Wrapper-")]//button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      let moreButton = document.evaluate('//div[contains(@class,"LoadMore__Wrapper-")]//button[contains(@class,"Button-sc-1o0ywp5-0")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      console.log('moreButton:: ', moreButton.singleNodeValue);
      if (moreButton && moreButton.singleNodeValue != null) {
        let index = 0;
        while (index < 7) {
          try {
            moreButton = document.evaluate('//div[contains(@class,"LoadMore__Wrapper-")]//button[contains(@class,"Button-sc-1o0ywp5-0")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            moreButton.singleNodeValue.click();
            console.log('more button clicked: ', index);
            index++;
            await new Promise((resolve, reject) => setTimeout(resolve, 2000));
            let scrollTop = 0;
            while (scrollTop !== 10000) {
              await stall(1000);
              scrollTop += 500;
              window.scroll(0, scrollTop);
              if (scrollTop === 10000) {
                await stall(500);
                break;
              }
            }
          } catch (e) {
            console.log('error on more button: ', e);
          }
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
