const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'incontinenceshop',
    transform: transform,
    domain: 'incontinenceshop.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      let url = window.location.href;
      try {
        document.getElementById('pd_url').remove();
      } catch (error) {
      }

      function allElement(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('img[class="product-image-photo"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      var temp = 0;
      // @ts-ignore
      const products = window.dlObjects;
      for (let k = 0; k < products.length; k++) {
        for (let i = 0; i < products[k].ecommerce.impressions.length; i++) {
          allElement('ID', products[k].ecommerce.impressions[i].id, temp);
          allElement('pd_url', url, temp);
          temp++;
        }
      }

      // Method to Retrieve Xpath content of a Single Node
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // XPATH Data Extraction For Aggregate Rating
      const currentProducts = getXpath("//p[@id='toolbar-amount']/span[2]/text()", 'nodeValue');
      const totalProducts = getXpath("//p[@id='toolbar-amount']/span[3]/text()", 'nodeValue');
      if (currentProducts == totalProducts) {
        addElementToDocument('noResults', 'noResults')
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
    });
    return await context.extract(productDetails, { transform });
  },
};