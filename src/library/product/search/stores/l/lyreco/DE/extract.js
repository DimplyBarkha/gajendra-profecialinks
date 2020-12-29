const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'lyreco',
    transform: transform,
    domain: 'lyreco.com',
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
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="product-container row col-12 mx-auto row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 px-0"]>div>div')[index];
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

    var img = getAllXpath('//div[@class="product-container row col-12 mx-auto row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 px-0"]/div/div/a/img/@src', 'nodeValue');
    if(img != null){
      for(var i=0; i<img.length; i++){
        if(img[i].includes("wid=300")){
          img[i] = img[i].replace("wid=300","wid=500");
        }
        if(img[i].includes("hei=300")){
          img[i] = img[i].replace("hei=300","hei=500");
        }
        addHiddenDiv('img', img[i], i);
      }
    }


  });
  return await context.extract(productDetails, { transform });
};

