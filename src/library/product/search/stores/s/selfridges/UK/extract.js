const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    transform,
    domain: 'selfridges.uk',
    zipcode: "''",
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
    await context.evaluate(async function () {
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(() => {
          window.scrollBy(0, 1000);
          resolve();
        }, 500));
      }
    });
    return await context.extract(data, { transform });
  },
};
