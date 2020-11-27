const { transform } = require("../../../../shared");
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'matas',
    transform: transform,
    domain: 'matas.dk',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
    const getAllXpath = (xpath, prop) => {
    const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const result = [];
    for (let index = 0; index < nodeSet.snapshotLength; index++) {
    const element = nodeSet.snapshotItem(index);
    if (element) result.push(prop ? element[prop] : element.nodeValue);
    }
    return result;
    };
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="row flex flex-wrap grid-overwrite--product-items"]>div')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      var vari = getAllXpath("//div[@class='productlist__products']//div[@class='review-stars__container review-stars__container--border']/@data-js-border-offset", 'nodeValue');
      if(vari != null){
        for(var i=0; i<vari.length; i++){
          var agg=vari[i].slice(0,-1)*5/100;
          addHiddenDiv('agg', agg, i);
        }
      }

    });
    return await context.extract(productDetails, { transform });
    }
  };
