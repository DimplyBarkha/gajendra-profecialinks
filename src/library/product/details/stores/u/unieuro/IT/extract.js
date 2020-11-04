const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    transform: cleanUp,
    domain: 'unieuro.it',
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
      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const sliceURL = (data2, data3, data4) => {
        var old = "height " + data2 + "*depth" + data3 + "*Width" + data4
        addElementToDocument('altImages', old);

      };
      // var URL1 = getAllXpath("//div[@class='techs']//span[(text()='Peso dell'imballo')]/following-sibling::span", 'nodeValue');
      var URL2 = getXpath("//div[@class='techs']//span[(text()='Altezza imballo')]/following-sibling::span/text()", 'nodeValue');
      var URL3 = getXpath("//div[@class='techs']//span[(text()='Profondità imballo')]/following-sibling::span/text()", 'nodeValue');
      var URL4 = getXpath("//div[@class='techs']//span[(text()='Larghezza imballo')]/following-sibling::span/text()", 'nodeValue');
      console.log(URL2)
      sliceURL(URL2, URL3, URL4);
    });
    await context.extract(productDetails);
  },
};

