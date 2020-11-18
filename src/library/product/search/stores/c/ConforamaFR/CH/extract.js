const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'ConforamaFR',
    transform: transform,
    domain: 'conforama.fr',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="detail-product"] > h3')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const name = document.querySelectorAll('div[class="detail-product"] > h3');
      let price;
      for (let i = 0; i < name.length; i++) {
        // @ts-ignore
        addHiddenDiv('prodName', document.querySelectorAll('div[class="detail-product"] > h3')[i].innerText, i);
        // @ts-ignore
        price = document.querySelectorAll('div[class="price-product"]')[i].innerText;
        var priceUpdated = price.replace("€", ".");
        addHiddenDiv('price', '€ ' + priceUpdated, i);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};