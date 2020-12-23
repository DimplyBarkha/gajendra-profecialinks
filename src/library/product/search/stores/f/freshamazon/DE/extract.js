const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    transform: transform,
    domain: 'freshamazon.de',
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
    const url = window.location.href;
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class*="a-section aok-relative"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };
    var desc1 = getAllXpath('//span[@class="a-price-whole"]/text()', 'nodeValue');
    var desc2 = getAllXpath('//span[@class="a-price-symbol"]/text()', 'nodeValue');
    var desc3 = getAllXpath('//a[@class="a-popover-trigger a-declarative"]/i/span/text()', 'nodeValue');

    if (desc1 != null) {
      for (var i = 0; i < desc1.length; i++) {
        desc1[i] = desc1[i].replace(",", ".");
        desc1[i] = desc1[i] + " " + desc2[i]
        addHiddenDiv('price', desc1[i], i);
      }
    }
    if (desc3 != null) {
      for (var i = 0; i < desc3.length; i++) {
        desc3[i] = desc3[i].split(" ")[0]
        if (desc3[i].includes(",")) {
          desc3[i] = desc3[i].replace(",", ".")
        }
        addHiddenDiv('pqr', desc3[i], i);
        addHiddenDiv('added-searchurl', url, i);
      }
    }

  });
  return await context.extract(productDetails, { transform });
};


