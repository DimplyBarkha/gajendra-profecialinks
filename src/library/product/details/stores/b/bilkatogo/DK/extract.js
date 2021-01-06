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
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const acceptCookies = document.getElementById('declineButton');
      if (acceptCookies) acceptCookies.click();
      addElementToDocument('productUrl', window.location.href);

      const productIdNode = document.evaluate('//div[@id=\'details\']//text()[contains(., \'Varenummer:\')]', document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue
        ? document.evaluate('//div[@id=\'details\']//text()[contains(., \'Varenummer:\')]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent : '';
      if (productIdNode) {
        const productIdRegex = /\d+/g;
        const productId = productIdRegex.exec(productIdNode)[0];
        const response = await fetch(`https://api.bilkatogo.dk/api/shop/v3/Product?u=w&productId=${productId}`, {
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,pl;q=0.8',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
          },
          referrer: 'https://www.bilkatogo.dk/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: null,
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        }).then(resp => resp.json());

        const brand = response.brand ? response.brand : '';
        if (brand) {
          addElementToDocument('product_brand', brand);
        }
      }

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
        finalPrice = integerPrice + ',' + decimalPrice + ' DKK';
        addElementToDocument('finalPrice', finalPrice);
      } else if (integerPrice && !decimalPrice) {
        finalPrice = integerPrice + ' DKK';
        addElementToDocument('finalPrice', finalPrice);
      } else if (!integerPrice && decimalPrice) {
        finalPrice = '0,' + decimalPrice + ' DKK';
        addElementToDocument('finalPrice', finalPrice);
      }

      // const unitPrice = document.querySelector('p[class*=\'separated-list\']>span:last-child')
      //   ? document.querySelector('p[class*=\'separated-list\']>span:last-child').innerText.trim() : '';
      // if (unitPrice) {
      //   // eslint-disable-next-line no-useless-escape
      //   const unitPriceRegex = /([\d,]+)\/?([\d,]+)?/g;
      //   // eslint-disable-next-line no-useless-escape
      //   const unitPriceUomRegex = /[^\.]+\.$/g;
      //   const unitPriceString = unitPriceRegex.exec(unitPrice)[1] + ' DKK';
      //   const unitPriceUomString = unitPriceUomRegex.exec(unitPrice)[0];
      let pricePerUnit = document.querySelector('div[class="product-sub-title"]');
      let pricePerUnitSliced = '', pricePerUnitUOM = '';
      let pricePerUnitTxt = pricePerUnit.innerText;
      let strt = 0, end = 0, endUOM = 0;
      for (let i = 0; i < pricePerUnitTxt.length; i++) {
        if (pricePerUnitTxt.charAt(i) === '/' && strt === 0)
          strt = i;
        else if (pricePerUnitTxt.charAt(i) === '/' && end === 0)
          end = i;
        else if (pricePerUnitTxt.charAt(i) === 'L' && end !== 0) {
          endUOM = i;
          break;
        }
      }

      pricePerUnitSliced = pricePerUnitTxt.substring(strt + 1, end).trim();
      pricePerUnitUOM = pricePerUnitTxt.substring(strt + 1, endUOM + 1).trim();
      addElementToDocument('pricePerUnit', pricePerUnitSliced);
      addElementToDocument('pricePerUnitUom', pricePerUnitUOM);
      let brandText = '', index = 0;
      for (let i = pricePerUnitTxt.length; i >= 0; i--) {
        if (pricePerUnitTxt.charAt(i) == '/') { index = i; break; }
      }
      brandText = pricePerUnitTxt.substring(index, pricePerUnitTxt.length);
      if(brandText.length > 4){
        addElementToDocument('product_brand', brandText);
      } 

      let expansionPanels = document.querySelectorAll('div.expansion-panel');
      if (document.querySelectorAll('div.expansion-panel')) {
        let expansionPanels = document.querySelectorAll('div.expansion-panel');
        for (let i = 0; i < expansionPanels.length; i++) {
          expansionPanels[i].querySelector('div.header-button').click();
        }
      }
    });
    await context.extract(productDetails, { transform });
  },
};
