const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'kmart',
    transform: transform,
    domain: 'kmart.com.au',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      function addHiddenDiv(id, content, index) {
        // @ts-ignore
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="product product_box small-6 medium-4 large-4 columns clearfix col "]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      };
      var abc = getAllXpath("//div[@class='product product_box small-6 medium-4 large-4 columns clearfix col ']/@data-attribute-productid", 'nodeValue');
      if (abc != null) {
        for (var i = 0; i < abc.length; i++) {
          abc[i] = "P_" + abc[i]
          addHiddenDiv('id', abc[i], i);
        }
      }
    });
    await context.extract(productDetails);
  },
};