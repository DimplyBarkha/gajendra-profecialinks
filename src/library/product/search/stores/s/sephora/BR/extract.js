const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
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
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      let popUps = document.querySelector('div.box-list-button div.button-progress');
      if (popUps) {
        popUps.click();
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
