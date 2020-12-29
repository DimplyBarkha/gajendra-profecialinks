const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer',
    transform: transform,
    domain: 'meijer.com',
    zipcode: '',
  },

  // implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
  //   await context.evaluate(async function () {
  //     function stall (ms) {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }
  //     let scrollTop = 500;
  //     while (true) {
  //       window.scroll(0, scrollTop);
  //       await stall(1000);
  //       scrollTop += 500;
  //       if (scrollTop === 10000) {
  //         break;
  //       }
  //     };
  //   });
  //  // await context.waitForSelector('div[class="quickview-mouseover-container tile-column"] a[class="thumb"]', {timeout: 20000});
  //   await context.extract(productDetails, { transform: transformParam });
  // },
};
