
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
      await new Promise(resolve => setTimeout(resolve, 2814));
      const element = document.getElementById("aplus");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        await new Promise(resolve => setTimeout(resolve, 2197));
      }
    })
    return await context.extract(productDetails, { transform });
  }
};