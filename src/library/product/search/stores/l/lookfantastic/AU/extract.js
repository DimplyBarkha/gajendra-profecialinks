const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'lookfantastic',
    transform: transform,
    domain: 'lookfantastic.com.au',
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
      const aggregateRating = getXpath('//div[@class="productBlock_imageContainer"]//img/@src', 'nodeValue');
      var ratingValue = aggregateRating ? aggregateRating.replace(/^\D+/g, '') : '';
      addElementToDocument('addedAggregateRating', (ratingValue ? (parseInt(ratingValue) / 20) : ''));
    });

    await context.extract(productDetails, { transform: transformParam });
  },
};
