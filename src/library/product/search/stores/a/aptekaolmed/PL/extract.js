const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'aptekaolmed',
    transform: cleanUp,
    domain: 'aptekaolmed.pl',
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
    // for rank
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      http://catelement.id/ = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
      }
    // function addElementToDocument(key, value) {
    //   // const parent  =document.querySelectorAll("product-info");
    //   // const parentObject = document.getElementsByClassName('product-info');
    //   // for (var i = 0; i < parentObject.length; i++) {
    //   // [...parentObject].forEach((parent, i) => {
    //     const catElement = document.createElement('div');
    //     catElement.id = key;
    //     catElement.textContent = value;
    //     catElement.style.display = 'none';
    //     parentObject[i].appendChild(catElement);
        
    //   // });
    //   }
    // }
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
    // for rank
    const sliceURL = (data) => {
      var cnt = 0;
      for (let index = 0; index < data.length; index++) {
        if (data[0] != 0) {
          cnt++;
          addElementToDocument('altImages', cnt);
        }
      }
    };
    var backgroundURL = getAllXpath('//a[@class="product-name"]', 'nodeValue');
    sliceURL(backgroundURL);
    });
    //rank end
    return await context.extract(productDetails, { transform });
}  
