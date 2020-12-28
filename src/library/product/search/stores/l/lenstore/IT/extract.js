const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'lenstore',
    transform: transform,
    domain: 'lenstore.it',
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
      const originalDiv = document.querySelectorAll('ul[id="ProductList"]>li')[index];
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
    var price = getAllXpath('//span[@class="u-price"]/text()', 'nodeValue');
    if (price != null) {
      for (var i = 0; i < price.length; i++) {
        price[i] = price[i].replace(",",".")
        addHiddenDiv('price', price[i], i);
      }
    }

    //product ID 
    var id = getAllXpath('//picture[@class="c-product-list__figure"]/source[1]/@srcset', 'nodeValue');
    if( id != null){
      for (var i = 0; i < id.length; i++) {
        if(id[i].includes("/")){
          var data = id[i].split("/");
          var sup = data[data.length - 1];
          if(sup.includes(".")){
            sup = sup.split(".")[0]
            addHiddenDiv('id', sup, i);
          }
        }
      }
    }

  });
  return await context.extract(productDetails, { transform });
};
