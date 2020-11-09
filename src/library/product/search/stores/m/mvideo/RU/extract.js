const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    transform: cleanUp,
    domain: 'mvideo.ru',
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
        const originalDiv = document.querySelectorAll("div[class='fl-product-tile c-product-tile ']")[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      let rankOrganic;
      try {
        rankOrganic = ((window.location.href).indexOf('offset=')) ? Number((window.location.href).replace(/.*offset=(.*)/, '$1')) : 0;
      }
      catch (err) {
      }
      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = rankOrganic + 1;
      }
      const urlProduct = document.querySelectorAll("div[class='fl-product-tile c-product-tile ']");
      for (let i = 0; i < urlProduct.length; i++) {
        addHiddenDiv('rankOrganic', rankOrganic++, i);
      }

    });
    return await context.extract(productDetails, { transform });
  },
}