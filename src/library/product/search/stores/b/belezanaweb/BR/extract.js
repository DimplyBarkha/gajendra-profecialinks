const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'belezanaweb',
    transform,
    domain: 'belezanaweb.com.br',
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
      let moreButton = document.evaluate('//button[contains(@class,"btn-load-more")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      console.log('moreButton:: ', moreButton.singleNodeValue);
      if (moreButton && moreButton.singleNodeValue != null) {
        let index = 0;
        // try {
        while (index < 4) {
          try {
            index++;
            moreButton = document.evaluate('//button[contains(@class,"btn-load-more")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            moreButton.singleNodeValue.click();
            console.log('more button clicked: ', index - 1);
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
            // console.log('error on more button: ', e);
          }
        }
        // } catch (e) {}
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
//   implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
//     await context.evaluate(async () => {
//       function stall (ms) {
//         return new Promise((resolve, reject) => {
//           setTimeout(() => {
//             resolve();
//           }, ms);
//         });
//       }

//       let scrollTop = 0;
//       while (scrollTop !== 20000) {
//         await stall(3000);
//         scrollTop += 500;
//         window.scroll(0, scrollTop);
//         if (scrollTop === 20000) {
//           await stall(100);
//           break;
//         }
//       }
//       const moreButton = document.evaluate('//button[contains(@class,"btn-load-more")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
//       console.log('moreButton:: ', moreButton.singleNodeValue);
//       if (moreButton && moreButton.singleNodeValue != null) {
//         let index = 0;
//         while (index < 10) {
//           await new Promise((resolve, reject) => setTimeout(resolve, 1000));
//           try {
//             const moreButton = document.evaluate('//button[contains(@class,"btn-load-more")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
//             moreButton.singleNodeValue.click();
//             // }catch(e) {}
//             // await new Promise((resolve, reject) => setTimeout(resolve, 500));
//             let scrollTop = 0;
//             while (scrollTop !== 10000) {
//               await stall(500);
//               scrollTop += 1000;
//               window.scroll(0, scrollTop);
//               if (scrollTop === 10000) {
//                 await stall(500);
//                 break;
//               }
//             }
//             index++;
//           } catch (e) {}
//           await new Promise((resolve, reject) => setTimeout(resolve, 1000));
//           // let scrollTop = 0;
//           // index ++;
//           //const scrollTop = 0;
//         }
//       }
//     });
//     return await context.extract(productDetails, { transform });
//   },
// };
