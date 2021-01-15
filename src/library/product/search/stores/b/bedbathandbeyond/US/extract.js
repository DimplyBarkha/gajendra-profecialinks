const { transform } = require('../../../../shared');

// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   const applyScroll = async function (context) {
//     console.log('calling applyScroll-----------');
//     await context.evaluate(async function () {
//       let scrollTop = 0;
//       while (scrollTop !== 20000) {
//         await stall(1000);
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
    country: 'US',
    store: 'bedbathandbeyond',
    transform,
    domain: 'bedbathandbeyond.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    await context.evaluate(() => {
      if (!document.querySelector('header[class*="SearchHeader"')) {
        throw new Error('Not a Search Page');
      }
      const products = document.querySelectorAll(
        '[data-locator="product_tile_rating"] > span',
      );
      products.forEach((product, index) => {
        const denominator =
          Number(
            product.querySelector('svg')
              ? product.querySelector('svg').getAttribute('width')
              : '',
          ) * 2;
        const numerator =
          Number(
            product.querySelector('svg:last-child')
              ? product.querySelector('svg:last-child').getAttribute('width')
              : '',
          ) * 100;
        const rating = (numerator / denominator) / 10;
        const ratingAttr = rating.toFixed(1);
        product.closest('article').setAttribute('rating', ratingAttr);
        product.closest('article').setAttribute('rankorganic', `${index + 1}`);
      });
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
