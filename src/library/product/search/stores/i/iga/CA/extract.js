const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    transform: transform,
    domain: 'iga.net',
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
      const originalDiv = document.querySelectorAll('div[class="item-product js-product js-equalized js-addtolist-container js-ga"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    function addElementToDocument(key, value) {
      const catElement = document.createElement("div");
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = "none";
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

    var id = getAllXpath('//div[@class="item-product js-product js-equalized js-addtolist-container js-ga"]/@data-product', 'nodeValue');
    if (id != null) {
      for (var i = 0; i < id.length; i++) {
        var a = id[i].split("ProductId':'")[1];
        a = a.split("',")[0];
        addHiddenDiv(id, a, i);
      }
    }
    try {
      var price = getAllXpath('//div[@class="item-product__price--sale"]/span/span/text() | //div[@class="item-product__price push--bottom"]/span/text()', 'nodeValue');
      if (price != null) {
        for (var i = 0; i < price.length; i++) {
          var price1 = price[i].replace(",", ".");
          addHiddenDiv("price", price1, i);
        }
      }
      const URL = window.location.href;
      try {
        document.getElementById("pd_url").remove();
      } catch (error) { }
      addElementToDocument("pd_url", URL);
    }
    // @ts-ignore
    // @ts-ignore
    catch (error) {
    }
  });
  return await context.extract(productDetails, { transform });
};