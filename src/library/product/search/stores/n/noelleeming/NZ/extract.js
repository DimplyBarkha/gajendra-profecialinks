const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'noelleeming',
    transform,
    domain: 'noelleeming.co.nz',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async () => {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }

      const searchUrl = window.location.href;
      const productList = document.querySelectorAll('li.block.product-list');

      productList && productList.forEach((item1) => {
        const doc = item1;
        addElementToDocument(doc, 'searchUrl', searchUrl);
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
