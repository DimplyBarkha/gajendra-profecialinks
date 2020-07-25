const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    domain: 'amazon.de',
    zipcode: '10117',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      var element = document.querySelectorAll("div[cel_widget_id*='aplus'] img");
      if (element) {
        element.forEach(async (node) => {
          node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        });
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
