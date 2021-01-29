
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'molsoncoors',
    transform: cleanUp,
    domain: 'mymolsoncoors.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      function appendData (data) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const name = `added-product-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
          addElementToDocument(name, data[key]);
        }
      }
      const data = {};
      data.url = window.location.href;
      data.availability = document.querySelector('#ccb2b-pdp-qtyplus-btn') ? 'In Stock' : 'Out Of Stock';
      appendData(data);
    });
    await context.extract(productDetails, { transform });
  },
};
