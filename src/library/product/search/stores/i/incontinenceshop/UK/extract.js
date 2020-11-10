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
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("li[class='item product-item']")[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addrankOrganic() {
        // @ts-ignore
        var totalData = window.dlObjects;
        for (var i = 0; i < totalData.length; i++) {
          var lengthData = totalData[i].ecommerce.impressions.length;
          for (var j = 0; j < lengthData; j++) {
            var data = totalData[i].ecommerce.impressions;
            addHiddenDiv('rankOrganic', data[j].position, j);
          }
        }
      }
      addrankOrganic();
    });
    return await context.extract(productDetails, { transform });
  },
};