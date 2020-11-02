const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'groo',
    transform: cleanUp,
    domain: 'groo.co.il',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      const priceCurrency = getXpath('//div[@class="price-num"]//text()[not(parent::span)][3]', 'nodeValue');
      const priceValue = getXpath('//div[@class="price-num"]//span[@class="big js-price"]', 'innerText');
      addElementToDocument('added_priceValue', priceCurrency + priceValue);

      const netWeightXpath = "//ul//li//div//span[contains(text(), 'משקל כולל')]";
      const netWeight = getXpath(netWeightXpath, 'innerText');
      var netWeightValue = '';
      if (netWeight != null) {
        netWeightValue = netWeight.split(':')[1];
      }
      addElementToDocument('added_netWeight', netWeightValue);

      const otherDescriptionXpath = "//div[@id='productExtraDescription']";
      const otherDescriptionStr = getXpath(otherDescriptionXpath, 'innerText');
      // .replace(/\r\n|\r|\n/g, ' ');
      addElementToDocument('added_productOtherInformation', otherDescriptionStr);

      const scriptText = getXpath('//script[@id="opportunity-schema"]', 'innerText');
      var scriptTextObj = JSON.parse(scriptText);
      addElementToDocument('added_skuNumber', scriptTextObj.sku);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
