const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'hagel-shop',
    transform: transform,
    domain: 'hagel-shop.de',
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
      const originalDiv = document.querySelectorAll('ul[class="products-grid thumbnails"]>li')[index];
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

    // for aggregate rating
    var agg = getAllXpath('//div[@class="rating-box"]/div/@style', 'nodeValue');
    if (agg != null) {
      for (var i = 0; i < agg.length; i++) {
        var abc = agg[i].split(":")[1].slice(0, -1)
        abc = (abc * 5) / 100;
        addHiddenDiv('abc', abc, i);
      }
    }

    // for rating count
    var rating = getAllXpath('//span[@class="rating-links"]/text()', 'nodeValue');
    if (rating != null) {
      for (var i = 0; i < rating.length; i++) {
        var rat = rating[i].split(" (")[1]
        var zz = rat.split(")")[0]
        addHiddenDiv('zz', zz, i);
      }
    }

    // price 
    var price = getAllXpath('//div[@class="price-box"]/p[@class="special-price"]/span[@class="price"]/text()  |  //div[@class="price-box"]/span[@class="regular-price"]/span/span/text()', 'nodeValue');
    if (price != null) {
      for (var i = 0; i < price.length; i++) {
        price[i] = price[i].replace(",",".")
        addHiddenDiv('price', price[i], i);
      }
    }

    var id = getAllXpath('//ul[@class="products-grid thumbnails"]/li//div[@class="visible"]/a/img/@src', 'nodeValue');
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
