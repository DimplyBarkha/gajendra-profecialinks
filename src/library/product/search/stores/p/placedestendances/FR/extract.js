const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'placedestendances',
    transform: transform,
    domain: 'placedestendances.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      if (document.querySelector('div.lien_voir_tout_container a')) {
        document.querySelector('div.lien_voir_tout_container a').click();
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
