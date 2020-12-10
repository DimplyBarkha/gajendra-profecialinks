
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'iceland',
    transform: null,
    domain: 'iceland.co.uk',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
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
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var abc = getAllXpath('//div[@class="product-header d-none d-md-block clearfix"]//div[@class="pdp-review-summary"]//div[@class="rating"]/div/child::*/@class', 'nodeValue');
      if (abc != null) {
        abc.pop();
        var cnt = 0;
        for (var j = 0; j < 5; j++) {
          if (abc[j].includes("fill")) {
            cnt = cnt + 1;
          }
          else if (abc[j].includes("half")) {
            cnt = cnt + 0.5;
          } else {
            cnt = cnt + 0;
          }
        }
        addElementToDocument('agg', cnt);
      }


      
    });
    await context.extract(productDetails);
    },
    };
