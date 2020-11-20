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
      var size = getAllXpath("//div[@class='fx-component size-list']//a[@role='button']/text()", 'nodeValue');
      if (size != null) {
        var xyz = size.join(" || ");
        addElementToDocument('xyz', xyz);
      }
      var information = getAllXpath("//div[@id='color-carousel']/a/span/img/@alt", 'nodeValue');
      if (information != null) {
        var kjf = information.join(" || ");
        addElementToDocument('kjf', kjf);
      }
      var information1 = getAllXpath("//div[@id='color-carousel']/a/@data-partnumber", 'nodeValue');
      if (information1 != null) {
        var mmm = information1.join(" || ");
        addElementToDocument('mmm', mmm);
      }
      var weight = getXpath("//li[contains(text(),'Box weight')]/text() | //li[contains(text(),'Weight')]/text()", 'nodeValue');
      if (weight != null) {
        weight = weight.split(": ")[1];
        addElementToDocument('weight', weight);
      }
      var color = getXpath("//li[contains(text(),'Colour')]/text()", 'nodeValue');
      var color1 = getXpath("//strong[contains(text(),'Colour')]/parent::li/text()", 'nodeValue');
      if (color != null) {
        color = color.split(": ")[1];
        addElementToDocument('color', color);
      }
      if (color1 != null) {
        // Material = Material.split(": ")[1];
        addElementToDocument('color', color1);
      }

      var Material = getXpath("//li[contains(text(),'Material')]/text()", 'nodeValue');
      var Material1 = getXpath("//strong[contains(text(),'Material')]/parent::li/text()", 'nodeValue');
      if (Material != null) {
        Material = Material.split(": ")[1];
        addElementToDocument('Material', Material);
      }
      if (Material1 != null) {
        // Material = Material.split(": ")[1];
        addElementToDocument('Material', Material1);
      }

      var direction = getXpath("//li[contains(text(),'Care instructions')]/text()", 'nodeValue');
      if (direction != null) {
        direction = direction.split(": ")[1];
        addElementToDocument('direction', direction);
      }
      var warning = getXpath("//strong[contains(text(),'Warning')]/parent::div/text()[2]", 'nodeValue');
      if (warning != null) {
        // warning = warning.split(": ")[1];
        addElementToDocument('warning', warning);
      }


      });

    await context.extract(productDetails);
  },
};

