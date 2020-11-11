const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'bernard',
    transform: cleanUp,
    domain: 'bernard.fr',
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
        const originalDiv = document.querySelectorAll("div[id='SKUDetailsDiv']")[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      let rankOrganic;
      try {
        rankOrganic = ((window.location.href).indexOf('page=')) ? Number((window.location.href).replace(/.*page=(.*)/, '$1')) : 0;
      }
      catch (err) {
      }
      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = (rankOrganic - 1) * 24 + 1;
      }
      const urlProduct = document.querySelectorAll("div[id='SKUDetailsDiv']");
      for (let i = 0; i < urlProduct.length; i++) {
        addHiddenDiv('rankOrganic', rankOrganic++, i);
      }

    });
    return await context.extract(productDetails, { transform });
  },
}