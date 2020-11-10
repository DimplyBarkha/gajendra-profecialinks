const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'primor',
    transform: cleanUp,
    domain: 'primor.eu',
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
    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
      // price
    };
    var desc1 = getXpath('//p[@class="our_price_display pull-left"]//span[@itemprop="price"]/text()', 'nodeValue');

    if (desc1 != null) {
      desc1 = desc1.replace(",", ".")
      addElementToDocument('desc1', desc1);
    }
    // list-price
    var desc2 = getXpath('//p[@id="old_price"]/span[@id="old_price_display"]/text()', 'nodeValue');

    if (desc2 != null) {
      desc2 = desc2.replace(",", ".").split(": ")[1]
      addElementToDocument('desc2', desc2);
    }
    // promotion
    var desc3 = getXpath('//p[@id="reduction_percent"]/span[@id="reduction_percent_display"]/text()', 'nodeValue');

    if (desc3 != null) {
      desc3 = desc3.split("-")[1]
      addElementToDocument('desc3', desc3);
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
    // Double Pipe Concatenation
    // const pipeSeparatorDouble1 = (id, data) => {
    //   // var doubleSeparatorText = data.join(' || ');
    //   addElementToDocument('id', data);
    // }

      // XPATH Data Extraction For Additional Description Bullet
      const addDescBulletInfo1 = getAllXpath("//div[@itemprop='description']/p/span/text() | //div[@itemprop='description']/p/text()", 'nodeValue');
      if (addDescBulletInfo1 != null){
        var abc = addDescBulletInfo1.join(" || ");
        addElementToDocument('id', abc);
        
      }


    });
  //rank end
  return await context.extract(productDetails, { transform });


};

