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
    const checkHttps = (data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].startsWith("/")) {
          addElementToDocument('thumbnail', 'https://www.real.de/' + data[i])
        }
        else {
          addElementToDocument('thumbnail', data[i])
        }
      }
    };
    // XPATH Data Extraction For Additional Description Bullet
    const addthumbnail = getAllXpath("//div[@class='img-wrapper rd-product__image-container']/img/@content", 'nodeValue');
    checkHttps(addthumbnail);

    var pagination = getXpath("//a[@class='btn -default']/i[@class='_icon icon-chevron-right']/@class", 'nodeValue');
    if (pagination === '_icon icon-chevron-right') {
      addclass('ul.pagination.list.-inline.item-pagination li:last-child a');
    };
  });
  return await context.extract(productDetails, { transform });
}
