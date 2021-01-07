const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    transform,
    domain: 'promofarma.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      try {
        // @ts-ignore
        document.querySelector('button[id="onetrust-accept-btn-handler"]').click()
        await new Promise(r => setTimeout(r, 10000));

      } catch (error) {

      }
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="rating-box"] div[class="rating-stars"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      const aggregateRating = document.querySelectorAll('div[class="rating-box"] div[class="rating-stars"]')
      for (let k = 0; k < aggregateRating.length; k++) {
        // @ts-ignore
        let singleRating = aggregateRating[k].style.width;
        singleRating = singleRating.slice(0, singleRating.length - 1)
        singleRating = (5 * singleRating) / 100;
        singleRating = singleRating.toFixed(1);
        addHiddenDiv('aggregateRating', singleRating, k);

      }

    });
    return await context.extract(productDetails, { transform });
  },
}