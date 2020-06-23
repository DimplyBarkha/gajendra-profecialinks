const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimePantry',
    transform,
    domain: 'amazon.com',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies, ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      const element = document.getElementById("detail-bullets");
      element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    })
    return await context.extract(productDetails, { transform });
  }
};
