const { transform } = require('./format');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await new Promise((resolve, reject) => setTimeout(resolve, 3000));
//   const applyScroll = async function (context) {
//     await context.evaluate(async function () {
//       let scrollTop = 0;
//       while (scrollTop !== 20000) {
//         await stall(2000);
//         scrollTop += 1000;
//         window.scroll(0, scrollTop);
//         if (scrollTop === 20000) {
//           await stall(2000);
//           break;
//         }
//       }
//       function stall (ms) {
//         return new Promise((resolve, reject) => {
//           setTimeout(() => {
//             resolve();
//           }, ms);
//         });
//       }
//     });
//   };
//   await applyScroll(context);
//   await context.evaluate(async () => {
//     function stall (ms) {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve();
//         }, ms);
//       });
//     }
//   let scrollTop = 0;
//   while (scrollTop !== 25000) {
//     await stall(1000);
//     scrollTop += 500;
//     window.scroll(0, scrollTop);
//     const sele = document.querySelectorAll('div.wrapper');
//     if (sele && sele.length >= 150) break;
//     if (scrollTop === 25000) {
//       await stall(500);
//       break;
//     }
//   }
//   // let moreButton = document.querySelector('li.pagination-next a[rel="next"]');
//   // console.log('moreButton:: ', moreButton);
//   // if (moreButton) {
//   //   let index = 0;
//   //   while (index < 5) {
//   //     try {
//   //       moreButton.click();
//   //       console.log('more button clicked: ', index);
//   //       index++;
//   //       await new Promise((resolve, reject) => setTimeout(resolve, 2000));
//   //       let scrollTop = 0;
//   //       while (scrollTop !== 10000) {
//   //         await stall(1000);
//   //         scrollTop += 500;
//   //         window.scroll(0, scrollTop);
//   //         // const sel = document.querySelectorAll('')
//   //         if (scrollTop === 10000) {
//   //           await stall(500);
//   //           break;
//   //         }
//   //       }
//   //     } catch (e) {
//   //       console.log('error on more button: ', e);
//   //     }
//   //   }
//   // }
//   // });

//   return await context.extract(productDetails, { transform });
// }

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'carrefour',
    transform,
    domain: 'carrefour.eu',
    zipcode: "''",
  },
};
  //implementation,
  // implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
  //   await context.evaluate(async () => {
  //     function stall(ms) {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }

  //     let scrollTop = 0;
  //     while (scrollTop !== 20000) {
  //       await stall(3000);
  //       scrollTop += 500;
  //       window.scroll(0, scrollTop);
  //       if (scrollTop === 20000) {
  //         await stall(2000);
  //         break;
  //       }
  //     }
  //     const moreButton = document.evaluate('//li[@class="pagination-next"]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  //     console.log("moreButton:: ", moreButton.singleNodeValue);
  //     if (moreButton && moreButton.singleNodeValue != null) {
  //       let index = 0;
  //       while (index < 8) {

  //         try {
  //           moreButton.singleNodeValue.click();
  //           console.log("more button clicked: ", index);
  //         } catch (e) { }
  //         await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  //         index++;
  //       }
  //     }
  //   });
  //   return await context.extract(productDetails, { transform });
  // },

