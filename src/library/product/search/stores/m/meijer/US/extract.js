const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer',
    transform: cleanUp,
    domain: 'meijer.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const sliceURL = (data) => {
        var cnt = 0;
        for (let index = 0; index < data; index++) {
          cnt++;
          addElementToDocument('rankOrganic',cnt);
        }
      };
      var backgroundURL = document.querySelectorAll('.tile-column.details').length;
      sliceURL(backgroundURL);
    });
    return await context.extract(productDetails, { transform });
  },
};
