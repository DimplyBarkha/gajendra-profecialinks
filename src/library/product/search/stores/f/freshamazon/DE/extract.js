const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    transform: cleanUp,
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
    function addclass(xpathforpagination) {
      var elems = document.querySelectorAll(xpathforpagination);
      elems[0].classList.add('pagination');
    }
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="sg-col-4-of-24 sg-col-4-of-12 sg-col-4-of-36 s-result-item s-asin sg-col-4-of-28 sg-col-4-of-16 sg-col sg-col-4-of-20 sg-col-4-of-32"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
        // addElementToDocument('abc' ,desc1[i]);
        addHiddenDiv('abc', desc1[i], i);
      }
    }
    // desc2 = desc1.replace(",", ".")
    if (desc3 != null) {
      for (var i = 0; i < desc3.length; i++) {
        desc3[i] = desc3[i].split(" ")[0]
        if (desc3[i].includes(",")) {
          desc3[i] = desc3[i].replace(",", ".")
        }

        addHiddenDiv('pqr', desc3[i], i);
      }
    }
      // desc2 = desc1.replace(",", ".")

  });
  //rank end
  return await context.extract(productDetails, { transform });


};


