const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'lojashampoo_pt',
    transform: transform,
    domain: 'lojashampoo.pt',
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
      const originalDiv = document.querySelectorAll('div[class="product-block item-default"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
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

    var rating = getAllXpath('//div[@class="NETREVIEWS_PRODUCT_STARS"]/div/text()', 'nodeValue');
    if (rating.length >= 1) {
      for (var i = 0; i < rating.length; i++) {
        rating[i] = rating[i].split("/")[0];
        // addHiddenDiv('rating', rating[i], i);
        addElementToDocument('rating', rating[i]);
      }
    }
    // addElementToDocument('rating', "rating Text");
  });
  return await context.extract(productDetails, { transform });
};
