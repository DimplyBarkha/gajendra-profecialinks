const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    transform: cleanUp,
    domain: 'johnlewis.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
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
      const xyz = getXpath("//div[@class='star-ratings']/div[@class='stars-empty']/@style", 'nodeValue');
      if (xyz != null) {
        var abc = xyz.split(": ")[1]
        var width = abc.slice(0, -2);
        width = (width * 5) / 100;
        addElementToDocument('star', width);
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};