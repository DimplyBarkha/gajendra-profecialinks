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
      // Double Pipe Concatenation
      const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        addElementToDocument(id, doubleSeparatorText);
      };
      // XPATH Data Extraction For Additional Description Bullet
      const addDescBulletInfo = getAllXpath("//div[@class='product attribute description wysiwyg-content']/div/ul/li/text()", 'nodeValue');
      pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);

      // @ts-ignore
      let category = window.dlObjects[0].ecommerce.detail.products[0].category;
      addElementToDocument('category', category);
      // @ts-ignore
      let quantity = document.querySelector('#qty').value;
      addElementToDocument('quantity', quantity);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
