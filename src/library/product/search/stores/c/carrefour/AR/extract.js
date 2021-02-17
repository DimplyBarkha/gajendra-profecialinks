const { transform } = require('./format');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await context.evaluate(async function () {
//     let scrollTop = 0;
//     while (scrollTop <= 20000) {
//       await stall(500);
//       scrollTop += 1000;
//       window.scroll(0, scrollTop);
//       if (scrollTop === 20000) {
//         await stall(8000);
//         break;
//       }
//     }
//     function stall (ms) {
//       return new Promise(resolve => {
//         setTimeout(() => {
//           resolve();
//         }, ms);
//       });
//     }
//   });
//   return await context.extract(productDetails, { transform });
// }
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AR',
    store: 'carrefour',
    transform,
    domain: 'carrefour.com.ar',
    zipcode: "''",
  },
  //   implementation,
  // };
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
      // let count = document.querySelectorAll('div.home-product-cards div.home-dest-electro').length;
        let iterCnt = 0;
        while (iterCnt < 5) {
        // const oldCount = count;
          try {
            document.querySelector('a.ver-mas-productos[style="display: block;"]') && document.querySelector('a.ver-mas-productos[style="display: block;"]').click();
            await new Promise(resolve => setTimeout(resolve, 4000));
            // count = document.querySelectorAll('div.home-product-cards div.home-dest-electro').length;

            window.scrollTo(0, document.body.scrollHeight);
            await new Promise(resolve => setTimeout(resolve, 4000));
          } catch (err) {
          }
          iterCnt++;
        // if (oldCount === count) {
        //   break;
        // }
        }
      });
    };
    await applyScroll(context);

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
