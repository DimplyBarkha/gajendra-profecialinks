const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'Efarma',
    transform: transform,
    domain: 'efarma.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      
      let scrollTop = 0;
      // while (scrollTop !== 20000) {
      //   await stall(500);
      //   scrollTop += 1000;
      //   window.scroll(0, scrollTop);
      //   if (scrollTop === 20000) {
      //     await stall(2000);
      //     break;
      //   }
      // }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const moreButton = document.evaluate('//div[@class="clerk-load-more-button"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      console.log("moreButton:: ", moreButton);
      if (moreButton && moreButton.singleNodeValue != null) {
        let index = 0;
        while (index < 8) {
         // await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          try {
            moreButton.singleNodeValue.click();
            await new Promise((resolve, reject) => setTimeout(resolve, 2000));
          // }catch(e) {}
            // await new Promise((resolve, reject) => setTimeout(resolve, 500));
            let scrollTop = 0;
            while (scrollTop !== 5000) {
              await stall(500);
              scrollTop += 1000;
              window.scroll(0, scrollTop);
              if (scrollTop === 10000) {
                await stall(500);
                break;
              }
            }
          } catch (e) {}
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          // let scrollTop = 0;
          //index ++;
          const scrollTop = 0;
          index++;
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
