const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'menards',
    transform: cleanUp,
    domain: 'menards.com',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // @ts-ignore
      const manufacturer = window.qubitEcProduct[0].product.manufacturer;
      addElementToDocument('detail-manufacturer', manufacturer);

      // @ts-ignore
      const category = window.qubitEcProduct[0].product.category;
      addElementToDocument('sub-category', category);
      

    });
    await context.extract(productDetails);
  },
};
