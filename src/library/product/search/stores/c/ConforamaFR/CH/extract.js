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
        const originalDiv = document.querySelectorAll('article[class="box-product    "]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const name = document.querySelectorAll('article[class="box-product    "]');
      // @ts-ignore
      const URL = window.tc_vars.originalPageURL;
      console.log(URL);
      let price;
      for (let i = 0; i < name.length; i++) {
        // @ts-ignore
        addHiddenDiv('prodName', document.querySelectorAll('article[class="box-product    "]')[i].innerText, i);
        // @ts-ignore
        price = document.querySelectorAll('div[class="price-product"]')[i].innerText;
        var priceUpdated = price.replace("€", ".");
        addHiddenDiv('price', '€ ' + priceUpdated, i);
      }
      addElementToDocument('pd_url', URL);
    });
    return await context.extract(productDetails, { transform });
  },
};