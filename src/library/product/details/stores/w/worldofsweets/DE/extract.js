const {transform}= require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'worldofsweets',
    transform : transform,
    domain: 'worldofsweets.de',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
        const popUps = document.getElementById('uc-btn-accept-banner');
        if (popUps) popUps.click();
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};



