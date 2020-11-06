const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'bilkatogo',
    transform: cleanUp,
    domain: 'bilkatogo.dk',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(async () => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const acceptCookies = document.getElementById('declineButton');
      if (acceptCookies) acceptCookies.click();
      addElementToDocument('productUrl', window.location.href);

      const outOfStockBtn = document.querySelector('div[class*="out-of-stock"]')
        ? document.querySelector('div[class*="out-of-stock"]') : '';
      const inStockBtn = document.querySelector('input[class*=\'product-quantity\']')
        ? document.querySelector('input[class*=\'product-quantity\']') : '';
      if (outOfStockBtn) {
        addElementToDocument('stockInfo', 'Out of stock');
      } else if (inStockBtn) {
        addElementToDocument('stockInfo', 'In stock');
      }

      const integerPrice = document.querySelector('span[class*=\'product-price__integer\']')
        ? document.querySelector('span[class*=\'product-price__integer\']').innerText.trim() : '';
      const decimalPrice = document.querySelector('span[class*=\'product-price__decimal\']')
        ? document.querySelector('span[class*=\'product-price__decimal\']').innerText.trim() : '';
      let finalPrice;
      if (integerPrice && decimalPrice) {
        finalPrice = integerPrice + ',' + decimalPrice;
        addElementToDocument('finalPrice', finalPrice);
      } else if (integerPrice && !decimalPrice) {
        finalPrice = integerPrice;
        addElementToDocument('finalPrice', finalPrice);
      } else if (!integerPrice && decimalPrice) {
        finalPrice = '0,' + decimalPrice;
        addElementToDocument('finalPrice', finalPrice);
      }
    });

    await context.extract(productDetails, { transform });
  },
};
