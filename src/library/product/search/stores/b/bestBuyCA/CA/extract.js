const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'bestbuyCA',
    transform: transform,
    domain: 'bestbuy.ca',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.waitForSelector('div[class*="loadMoreRow_"] button');
    await context.evaluate(async () => {
      await new Promise((resolve, reject) => setTimeout(resolve, 10000));
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      // let scrollTop = 0;
      // while (scrollTop !== 10000) {
      //   await stall(1000);
      //   scrollTop += 500;
      //   window.scroll(0, scrollTop);
      //   if (scrollTop === 10000) {
      //     await stall(500);
      //     break;
      //   }
      // }
      // const moreButton = document.evaluate('//div[contains(@class,"loadMoreRow_")]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
     // 
      const moreButton = document.querySelector('div[class*="loadMoreRow_"] button');
      console.log('moreButton:: ', moreButton.singleNodeValue);
      if (moreButton) {
        let index = 0;
        while (index < 7) {
          try {
            moreButton.click();
            console.log('more button clicked: ', index);
          } catch (e) { }
          await new Promise((resolve, reject) => setTimeout(resolve, 5000));
          let scrollTop = 0;
          while (scrollTop !== 5000) {
            await stall(500);
            scrollTop += 500;
            window.scroll(0, scrollTop);
            if (scrollTop === 5000) {
              await stall(1000);
              break;
            }
          }
          index++;
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
