const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    transform: transform,
    domain: 'iga.net',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="item-product js-product js-equalized js-addtolist-container js-ga"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
    var id = getAllXpath('//div[@class="item-product js-product js-equalized js-addtolist-container js-ga"]/@data-product', 'nodeValue');
    if (id != null) {
      for (var i = 0; i < id.length; i++) {
        var a = id[i].split("ProductId':")[1];
        a = a.split("',")[0];
        addHiddenDiv(id, a, i);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
