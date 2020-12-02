const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'labaie',
    transform,
    domain: 'labaie.com',
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
      if (document.querySelector('#consent-close')) {
        // @ts-ignore
        document.querySelector('#consent-close').click();
      }
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }

      const searchUrl = window.location.href;
      const productList = document.querySelectorAll('div[data-tile-start]');
      productList && productList.forEach((item1) => {
        const doc = item1;
        addElementToDocument(doc, 'searchUrl', searchUrl);
      });
      const productList1 = document.querySelectorAll('.primary-images-wrapper');
      productList1 && productList1.forEach((item1) => {
        const doc = item1;
        addElementToDocument(doc, 'searchUrl', searchUrl);
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
