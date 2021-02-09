const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'idealclean',
    transform: transform,
    domain: 'ideal_clean.de',
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
      const originalDiv = document.querySelectorAll('span[class="ant-typography LYSTypography_h3__3I_BO ProductPrice_priceValue__YY2PQ"]')[index];
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
    var price = getAllXpath('//span[@class="ant-typography LYSTypography_h3__3I_BO ProductPrice_priceValue__YY2PQ"]//text()', 'nodeValue');
    if (price.length >= 1) {
      for (var i = 0; i < price.length; i++) {
        price[i] = price[i].replace(",", ".");
        addHiddenDiv("price", price[i], i);
      }
    }

  });
  return await context.extract(productDetails, { transform });
}
