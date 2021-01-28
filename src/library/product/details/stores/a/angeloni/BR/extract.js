const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'angeloni',
    transform,
    domain: 'angeloni.com.br/super',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    // await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async () => {
      // let scrollTop = 0;
      // while (scrollTop <= 20000) {
      //   await stall(100);
      //   scrollTop += 1000;
      //   window.scroll(0, scrollTop);
      //   if (scrollTop === 20000) {
      //     await stall(3000);
      //     break;
      //   }
      // }
      // function stall(ms) {
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       resolve();
      //     }, ms);
      //   });
      // }

    });
    return await context.extract(productDetails, { transform });
  },
};

