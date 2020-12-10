const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'iceland',
    transform: transform,
    domain: 'iceland.co.uk',
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
      const originalDiv = document.querySelectorAll('div[class="feefo-ctr"]')[index];
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
    var abc = getAllXpath('//div[@class="rating"]/div/child::*/@class', 'nodeValue');
    if (abc != null) {
      var arr = [];
      var len = abc.length / 6
      var p = 0;
      for (var i = 0; i < len; i++) {
        for (var j = 0; j < 6; j++) {
          if (j != 5) {
            arr.push(abc[p]);
          }
          p = p + 1;
        }
      }
      var q = 0;
      var agg = [];
      for (var i = 0; i < arr.length / 5; i++) {
        var cnt = 0;
        for (var j = 0; j < 5; j++) {
          if (arr[q].includes("fill")) {
            cnt = cnt + 1;
          }
          else if (arr[q].includes("half")) {
            cnt = cnt + 0.5;
          } else {
            cnt = cnt + 0;
          }
          q = q + 1;
        }
        agg.push(cnt);
      }
      for (var i = 0; i < agg.length; i++) {
        addHiddenDiv('aggregate', agg[i], i);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
