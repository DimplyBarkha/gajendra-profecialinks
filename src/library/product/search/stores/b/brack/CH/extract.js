const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    transform: transform,
    domain: 'brack.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    // await context.evaluate(async () => {
    //   let scrollTop = 0;
    //   while (scrollTop !== 15000) {
    //     await stall(1000);
    //     scrollTop += 1000;
    //     window.scroll(0, scrollTop);
    //     if (scrollTop === 15000) {
    //       await stall(1000);
    //       break;
    //     }
    //   }
    //   function stall (ms) {
    //     return new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         resolve();
    //       }, ms);
    //     });
    //   }
    // });

    await context.evaluate(async () => {
      const products = document.querySelectorAll('li.product-card');
      products.forEach((product, index) => {
        product.setAttribute('rankorganic', `${index + 1}`);
      });
    });

    return await context.extract(productDetails, { transform });
  },
};
