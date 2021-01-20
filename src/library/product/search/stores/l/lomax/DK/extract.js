const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'lomax',
    transform: transform,
    domain: 'lomax.dk',
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
      const aggr = getXpath("//div[@class='product-info border-bottom py-3']/@data-gtm-rating", 'nodeValue');
      try {
        if (aggr != null) {
          let str = aggr
          var a = str.replace('.', ',')
          addElementToDocument('aggr', a)
        }
      }
      catch (error) {
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
