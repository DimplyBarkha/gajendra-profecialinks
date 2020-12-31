const { transform } = require('../../../../shared');
// const implementation = async function (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   const applyScroll = async function (context) {
//     await context.evaluate(async function () {
//       let scrollTop = 0;
//       while (scrollTop !== 20000) {
//         scrollTop += 1000;
//         window.scroll(0, scrollTop);
//         await stall(1000);
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
//   return await context.extract(productDetails, { transform });
// };
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'instacart_publix',
    transform: transform,
    domain: 'instacart.com',
    zipcode: '',
  },
  // implementation,
};
