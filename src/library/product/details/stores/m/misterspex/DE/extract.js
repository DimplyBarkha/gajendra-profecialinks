const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'misterspex',
    transform,
    domain: 'misterspex.de',
    zipcode: "''",
  },
  implementation: async ({ url }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      // description Block
      addHiddenDiv('spex_availability', document.getElementById('addToBasketButtonText') ? 'In Stock' : 'out of stock');
    });
    return await context.extract(productDetails);
  },
};