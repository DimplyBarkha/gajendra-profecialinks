
const { transform } = require('../CA/format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    transform,
    domain: 'sephora.ca',
    zipcode: '',
  },
  // implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
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
  // },
};
