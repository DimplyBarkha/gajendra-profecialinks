const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    transform: transform,
    domain: 'auchan.fr',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productDetails: data }) => {
    const { transform } = parameters;
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        addHiddenDiv('custom-product-info-availablityText', window.product.stock.stockLevelStatus.code);

      } catch (error) {
        console.log('Error: ', error);
      }
    })
    return await context.extract(data, {transform});
  }
};
