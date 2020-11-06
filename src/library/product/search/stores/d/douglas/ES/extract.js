const { transform } = require('./transform');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;

//   await new Promise((resolve, reject) => setTimeout(resolve, 20000));

//   await new Promise((resolve, reject) => setTimeout(resolve, 10000));
//   const applyScroll = async function (context) {
//     console.log('calling applyScroll-----------');
//     await context.evaluate(async function () {
//       let scrollTop = 0;
//       while (scrollTop !== 20000) {
//         await stall(500);
//         scrollTop += 1000;
//         console.log('calling applyScroll evaluate-----------', window);
//         window.scroll(0, scrollTop);
//         if (scrollTop === 20000) {
//           await stall(5000);
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
//   return await context.extract(productDetails, { transform });
// }

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'douglas',
    transform,
    domain: 'douglas.es',
    zipcode: '',
  },
};
