const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'incontinenceshop',
    transform: cleanUp,
    domain: 'incontinenceshop.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addrankOrganic() {
        // @ts-ignore
        var totalData = window.dlObjects;
        for (var i = 0; i < totalData.length; i++) {
          var lengthData = totalData[i].ecommerce.impressions.length;
          for (var j = 0; j < lengthData; j++) {
            var data = totalData[i].ecommerce.impressions;
            addElementToDocument('rankOrganic', data[j].position);
          }
        }
      }
      addrankOrganic();
    });
    return await context.extract(productDetails, { transform });
  },
};