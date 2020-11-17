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
      var rank = transform.rankCounter;
      var rankOrganic1 = transform.rankCounter;
      console.log(rank);
      console.log(rankOrganic1);
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("li[class='item product-item']")[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      let url = window.location.href;
      let rankOrganic;
      try {
        rankOrganic = ((window.location.href).indexOf('p=')) ? parseInt((window.location.href).replace(/.*p=(.*)/, '$1')) : 0;
      }
      catch (err) {
      }
      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = ((rankOrganic - 1) * 30) + 1;
      }
      const urlProduct = document.querySelectorAll("li[class='item product-item']");
      for (let i = 0; i < urlProduct.length; i++) {
        addHiddenDiv('rankOrganic', rankOrganic++, i);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};