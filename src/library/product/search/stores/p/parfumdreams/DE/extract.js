const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    transform: transform,
    domain: 'parfumdreams.de',
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
      const originalDiv = document.querySelectorAll('div[class*="product-image"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    //const ean = getXpath('//*[@id="content-wrapper"]/div[1]/div[2]/script[2]/text()', 'nodeValue');
    const ean = document.querySelectorAll("div.main-content > script:nth-child(6)")
    let testArray = ean[0].childNodes[0].data.split(',')
    for (var i = 0; i < testArray.length; i++) {
      if (testArray[i].includes("ean")) {
        let eanValue = testArray[i].split(':');
        eanValue = eanValue[1];
        //console.log(i + eanValue)
        addHiddenDiv('ean', eanValue, i)
      }
    }
    // price 
  });
  return await context.extract(productDetails, { transform });
};