const { transform } = require('../../../u/ubaldi/FR/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'ubaldi',
    transform,
    domain: 'ubaldi.fr',
    zipcode: '',
  },

   implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(function () {
      let htmlContent = document.querySelector('pre').textContent;
      if (htmlContent) {
        htmlContent = JSON.parse(htmlContent);
        if (htmlContent['html_content']) {
          document.body.innerHTML = htmlContent['html_content'];
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },

};
