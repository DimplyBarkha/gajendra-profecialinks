const { cleanUp } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'coradrive',
    transform: cleanUp,
    domain: 'coradrive.fr',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        const dataObject = window.vue.ProductDetail.product;
        if (dataObject) {
          addHiddenDiv('variantId', dataObject.id);
          addHiddenDiv('pd_price_per_unit', dataObject.prix_unite_ref_tri.replace('.', ','));
        }
      } catch (error) {
        console.log('data object not present');
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
