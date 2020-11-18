const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    transform: cleanUp,
    domain: 'petlove.com.br',
    zipcode: '',
  },
  implementation: async ({ id }, parameters, context, { productDetails, transform }) => {
    await context.evaluate(async () => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      const brand = document.querySelector('div.breadcrumb li.brand span') ? document.querySelector('div.breadcrumb li.brand span').textContent : '';
      const name = document.querySelector('h1[itemprop="name"]') ? document.querySelector('h1[itemprop="name"]').textContent : '';
      addElementToDocument('name_extended', [brand, name].join(' - '));
    });
    await context.extract(productDetails, { transform });
  },
};
