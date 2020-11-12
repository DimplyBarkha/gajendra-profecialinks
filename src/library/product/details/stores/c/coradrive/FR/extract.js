const { cleanUp } = require('../../../../shared');

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
        }
      } catch (error) {
        console.log('data object not present');
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
