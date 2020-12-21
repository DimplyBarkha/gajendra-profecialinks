const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'snipes',
    transform: transform,
    domain: 'snipes.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // aggregateRating
      var str = getXpath('//div[@class="b-rating-value"]/@style', 'nodeValue');
      var regexp = /(\d+)%/;
      var result = String(str).match(regexp);
      var rating = result[1];
      if (rating != null) {
        var rating1 = rating / 20;
        addElementToDocument('aggregateRating', rating1);
      }
    });
    await context.extract(productDetails);
  },
};
