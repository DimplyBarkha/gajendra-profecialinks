const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'carrefour',
    transform,
    domain: 'carrefouruae.com',
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
      let moreButton = document.evaluate('//button[@class="ltr-1upsixo"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      console.log('moreButton:: ', moreButton.singleNodeValue);
      if (moreButton && moreButton.singleNodeValue != null) {
        let index = 0;
        while (index < 3) {
          try {
            moreButton = document.evaluate('//button[@class="ltr-1upsixo"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
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
//   implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
//     await new Promise((resolve, reject) => setTimeout(resolve, 3000));
//     const applyScroll = async function (context) {
//       await context.evaluate(async function () {
//         let count = document.querySelectorAll('ul[data-testid="scrollable-list-view"] div[class="ltr-6hrfmx"]').length;
//         let itercnt = 0;
//         while (itercnt < 2) {
//           // const oldCount = count;
//           try {
//             // document.querySelector('button.ltr-1upsixo') && document.querySelector('button.ltr-1upsixo').click();
//             // await new Promise(resolve => setTimeout(resolve, 2000));
//             // count = document.querySelectorAll('ul[data-testid="scrollable-list-view"] div[class="ltr-6hrfmx"]').length;
//             const scrollElement = document.querySelector('ul[data-testid="scrollable-list-view"] > li');
//             const moreBtn = document.querySelector('button.ltr-1upsixo');
//             // await new Promise((resolve, reject) => setTimeout(resolve, 3000));
//             // if (scrollElement) {
//             if (moreBtn) {  
//               if (scrollElement)
//                 scrollElement.scrollIntoView({ behaviour: 'smooth', block: 'end' });
//               await new Promise(resolve => setTimeout(resolve, 2000));
//               document.querySelector('button.ltr-1upsixo').click();
//             }  
//           } catch (err) {
//           }
//           itercnt++;
//           // if (oldCount === count) {
//           //   break;
//           // }
//         }
//       });
//     };
//     // await applyScroll(context);

//     await new Promise((resolve, reject) => setTimeout(resolve, 1000));
//     return await context.extract(productDetails, { transform });
//   },
// };
