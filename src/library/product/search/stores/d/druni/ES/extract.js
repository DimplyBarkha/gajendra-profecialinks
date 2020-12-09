const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'druni',
    transform: transform,
    domain: 'druni.es',
    zipcode: "''",
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      let scrollTop = 0;
      const objDiv = document.getElementById('df-results__dfclassic');
      while (scrollTop !== 15000) {
        await stall(1000);
        scrollTop += 3000;
        objDiv.scroll(0, scrollTop);
        if (scrollTop === 15000) {
          await stall(1000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
