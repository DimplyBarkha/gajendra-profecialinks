const { transform } = require('../../sainsburys/uk/transform');
// const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    transform: transform,
    domain: 'sainsburys.co.uk',
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
    //for rank
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("div[class='productNameAndPromotions']")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    const url = window.location.href
    const products = document.querySelectorAll("div[class='productNameAndPromotions']");
    for (let i = 0; i < products.length; i++) {
    addHiddenDiv('URL', url, i);
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
  // var thumbnail = getAllXpath('//div[@class="productNameAndPromotions"]/h3/a/img/@src', 'nodeValue');
  //     if (!thumbnail.includes('https')) {
  //       var abc = ('https:') + thumbnail

  //       addHiddenDiv('image', abc);
  //     }
  //     else {
        
  //       //  ('https:')
    
  //       addHiddenDiv('image',thumbnail);
  //     }

  });
  //rank end
  return await context.extract(productDetails, { transform });
}