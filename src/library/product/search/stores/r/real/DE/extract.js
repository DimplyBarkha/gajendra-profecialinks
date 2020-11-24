const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'real',
    transform: transform,
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
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
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
    const URL = window.location.href;
    try {
      document.getElementById('pd_url').remove();
    } catch (error) {
    }
    addElementToDocument('pd_url', URL);
  });
  return await context.extract(productDetails, { transform });
}