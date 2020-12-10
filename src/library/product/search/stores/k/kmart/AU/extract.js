const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'kmart',
    transform: transform,
    domain: 'kmart.com.au',
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

      const originalDiv = document.querySelectorAll('div[class="product product_box small-6 medium-4 large-4 columns clearfix col "]')[index];

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







    // price

    var abc = getAllXpath("//div[@class='product product_box small-6 medium-4 large-4 columns clearfix col ']/@data-attribute-productid", 'nodeValue');
      if (abc != null) {
        for (var i = 0; i < abc.length; i++) {
          abc[i] = "P_" + abc[i]
          addHiddenDiv('id', abc[i], i);
        }
      }



  });

  return await context.extract(productDetails, { transform });

};