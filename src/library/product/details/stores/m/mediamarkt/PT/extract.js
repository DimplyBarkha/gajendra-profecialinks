const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.pt',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.innerHTML = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const product = window.product;
      if (product) {
        const availablityText = product.available ? 'In Stock' : 'Out Of Stock';
        addHiddenDiv('custom-product-availablity-text', availablityText);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
