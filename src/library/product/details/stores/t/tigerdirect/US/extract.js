const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'tigerdirect',
    transform: cleanUp,
    domain: 'tigerdirect.com',
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
    // Method to Retrieve Xpath content of a Single Node
    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };
    
    // for rank
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
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
    // for rank
    const sliceURL = (data1,data2,data3,data4,data5) => {
      var cnt = data1+" || "+data2+" || "+data3+" || "+data4+" || "+data5;
          addElementToDocument('altImages', cnt);
          //addElementToDocument('altImages', cnt);
      }
    var URL1 = getXpath('//div[@class="pdp-variants"]//ul/li[1]/a//@href', 'nodeValue');
    var URL2 = getXpath('//div[@class="pdp-variants"]//ul/li[2]/a//@href', 'nodeValue');
    var URL3 = getXpath('//div[@class="pdp-variants"]//ul/li[3]/a//@href', 'nodeValue');
    var URL4 = getXpath('//div[@class="pdp-variants"]//ul/li[4]/a//@href', 'nodeValue');
    var URL5 = getXpath('//div[@class="pdp-variants"]//ul/li[5]/a//@href', 'nodeValue');
    if (URL1 != 0) {
      URL1 = URL1.replace("/applications/searchtools/item-details.asp?EdpNo=", "");
    }
    if (URL2 != 0) {
      URL2 = URL2.replace("/applications/searchtools/item-details.asp?EdpNo=", "");
    }
    if (URL3 != 0) {
      URL3 = URL3.replace("/applications/searchtools/item-details.asp?EdpNo=", "");
    }
    if (URL4 != 0) {
      URL4 = URL4.replace("/applications/searchtools/item-details.asp?EdpNo=", "");
    }
    if (URL5 != 0) {
      URL5 = URL5.replace("/applications/searchtools/item-details.asp?EdpNo=", "");
    }
    // URL1 = URL1.replace("/applications/searchtools/item-details.asp?EdpNo=", "");
    // URL2 = URL2.replace("/applications/searchtools/item-details.asp?EdpNo=", "");
    // URL3 = URL3.replace("/applications/searchtools/item-details.asp?EdpNo=", "");
    // URL4 = URL4.replace("/applications/searchtools/item-details.asp?EdpNo=", "");
    // URL5 = URL5.replace("/applications/searchtools/item-details.asp?EdpNo=", "");
    sliceURL(URL1,URL2,URL3,URL4,URL5);
    // var upc = ""
    // addElementToDocument('upc', upc);
  });
  //rank end
  return await context.extract(productDetails, { transform });
}
