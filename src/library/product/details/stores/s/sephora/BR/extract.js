const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'sephora',
    transform,
    domain: 'sephora.com.br',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      let popUp = document.querySelector('div.overlay-cookies div.terms-accept div.button-progress');
      if (popUp) {
        popUp.click();
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};