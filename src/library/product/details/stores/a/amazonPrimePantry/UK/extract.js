
const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazonPrimePantry',
    transform,
    domain: 'amazon.co.uk',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies, ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      const element = document.getElementById("detail-bullets");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }
    })
    return await context.extract(productDetails, { transform });
  }
};