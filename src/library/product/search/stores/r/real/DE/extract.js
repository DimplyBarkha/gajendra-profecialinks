const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'real',
    transform: cleanUp,
    domain: 'real.de',
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
    function addclass(xpathforpagination) {
      var elems = document.querySelectorAll(xpathforpagination);
      elems[0].classList.add('pagination');
    }
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("div[id='rd-item-grid']")[0];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    // Method to Retrieve Xpath content of a Single Node
    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };
    var pagination = getXpath("//a[@class='btn -default']/i[@class='_icon icon-chevron-right']/@class", 'nodeValue');
    if (pagination === '_icon icon-chevron-right') {
      addclass('ul.pagination.list.-inline.item-pagination li:last-child a');
    };
    try {
      var myobj = document.getElementById("URL").remove();
    } catch (error) {
    }
    const url = window.location.href;
    addHiddenDiv('URL', url);
  });
  return await context.extract(productDetails, { transform });
}
