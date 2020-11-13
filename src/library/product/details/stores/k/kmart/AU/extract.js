const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'kmart',
    transform: cleanUp,
    domain: 'kmart.com.au',
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

      // XPATH Data Extraction For Additional Description Bullet
      const addDescBulletInfo1 = getXpath("//div[@class='product-details-desc']/text()[1]", 'nodeValue');
      const addDescBulletInfo2 = getAllXpath("//div[@class='product-details-desc']/ul/li/text()", 'nodeValue');
      var abc = ""
      if (addDescBulletInfo1 != null) {
        if (addDescBulletInfo2 != null) {
          abc = addDescBulletInfo2.join(" || ");
          abc = addDescBulletInfo1 + " || " + abc
        }
      }
      if (addDescBulletInfo1 != null) {
        if (addDescBulletInfo2 == null) {
          abc = addDescBulletInfo1;
        }
      }
      if (addDescBulletInfo2 != null) {
        if (addDescBulletInfo1 == null) {
          var bullet = addDescBulletInfo2.join(" || ");
          abc = bullet;
        }
      }
      if (abc != null) {
        addElementToDocument('abc', abc);
      }
      var info1 = getAllXpath("//div[@class='product-details-desc']/ul/li/text()", 'nodeValue');
      if (info1 != null) {
        var pqr = info1.join(" || ");
        addElementToDocument('pqr', pqr);
      }

    });

    await context.extract(productDetails);
  },
};

