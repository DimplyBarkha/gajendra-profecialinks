const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    transform: cleanUp,
    domain: 'promofarma.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
        }
      // Method to Retrieve Xpath content of a Single Node
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var URL2 = getXpath('(//a[@class="MagicZoom"]/text())', 'nodeValue');
      if (URL2 != null) {
        URL2 = "Yes"
      } else {
        URL2 = "No"
      }
      addElementToDocument('zoom', URL2);
    });
    await context.extract(productDetails);
  },
};

