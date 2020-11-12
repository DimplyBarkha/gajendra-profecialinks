const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'incontinenceshop',
    transform: cleanUp,
    domain: 'incontinenceshop.com',
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
      var finalDescText;
      // Double Pipe Concatenation
      const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        finalDescText = doubleSeparatorText;
        addElementToDocument(id, doubleSeparatorText);
      };
      // XPATH Data Extraction For Additional Description Bullet
      const addDescBulletInfo = getAllXpath("//div[@class='product attribute description wysiwyg-content']/div/ul/li/text()", 'nodeValue');
      pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);

      // Method to Retrieve Xpath content of a Single Node
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      // @ts-ignore
      let category = window.dlObjects[0].ecommerce.detail.products[0].category;
      addElementToDocument('category', category);
      const youtubeID = getXpath("//div[@class='product-video']/@data-code", 'nodeValue');
      try {
        if (youtubeID.length > 0) {
          const video = "https://youtu.be/" + youtubeID;
          addElementToDocument('video', video);
        }
      } catch (error) {
      }
      var spaceText;
      // space Pipe Concatenation
      const spaceSeparatorDouble = (data) => {
        spaceText = data.join(' ');
      };
      const addDescInfo = getAllXpath("//div[@class='product attribute description wysiwyg-content']/div/p/text()", 'nodeValue');
      spaceSeparatorDouble(addDescInfo);

      addElementToDocument('description', spaceText + ' || ' + finalDescText);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
