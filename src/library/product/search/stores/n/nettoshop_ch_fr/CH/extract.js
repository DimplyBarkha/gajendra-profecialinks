const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'nettoshop_ch_fr',
    transform: transform,
    domain: 'nettoshop.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function allElement(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="c-product-grid-item__title"]>a')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
      let URLID, splitURL, splitURLLength;
      let totalProducts = document.querySelectorAll('div[class="c-product-grid-item__title"]>a');
      for (let i = 0; i < totalProducts.length; i++) {
        URLID = totalProducts[i].attributes[0].nodeValue;
        splitURL = URLID.split('/');
        splitURLLength = splitURL.length;
        allElement('productID', splitURL[splitURLLength - 1], i);
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
      const aggregateRating = getAllXpath("//div[@class='c-rating c-rating--read-only ember-view']/@title", 'nodeValue');
      for (let i = 0; i < aggregateRating.length; i++) {
        allElement('aggregateRating', aggregateRating[i].split('/')[0], i);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
