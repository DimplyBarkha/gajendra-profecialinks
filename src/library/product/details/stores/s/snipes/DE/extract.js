
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'snipes',
    transform: null,
    domain: 'snipes.com',
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
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      var pp = getAllXpath("(//div[@class='b-pdp-attribute b-pdp-attribute--size js-pdp-attributes--size']/div/a/@data-value)", 'nodeValue');
      if (pp != null) {
        var ab = pp.join(' | ');
        addElementToDocument('ab', ab);
      }

      // Method to Retrieve Xpath content of a Multiple Nodes

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var description = getXpath('//div[@class="js-target"]/a/text()', 'nodeValue');
      var description1 = getXpath("(//div[@class='b-pdp-carousel-item']/picture/img/@alt)[1]", 'nodeValue');
      description = description + ' ' + description1;
      addElementToDocument('description', description);
    });
    await context.extract(productDetails);
  },
};
