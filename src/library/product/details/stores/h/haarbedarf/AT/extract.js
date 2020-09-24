const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'haarbedarf',
    transform: cleanUp,
    domain: 'haarbedarf.at',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    // await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.evaluate(async function () {
    });
    await context.extract(productDetails);
  },
};
