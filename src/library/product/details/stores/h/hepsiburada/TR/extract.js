const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'hepsiburada',
    transform,
    domain: 'hepsiburada.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const upc = window.utagData ? window.utagData.product_barcode : '';
      document.body.setAttribute('upc', upc);
      const data = document.querySelector('#productDescriptionContent') ? document.querySelector('#productDescriptionContent').textContent.trim() : '';
      var bullets = JSON.stringify(data.match(/•|\*/gi) ? data.match(/•|\*/gi).length : 0);
      document.body.setAttribute('bullet_count', bullets);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
