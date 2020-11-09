const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'coopvitality',
    transform: cleanUp,
    domain: 'coopvitality.ch',
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
      const originalDiv = document.querySelectorAll('ol[class="products list items product-items "]>li')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let rankOrganic;
    let url = window.location.href;
    let checkPageNumber = url.split('?')[1];
    if(checkPageNumber != null){
      checkPageNumber = checkPageNumber.split("&")[0];
    }
    
    try {
      if (checkPageNumber.startsWith('p=')) {
        rankOrganic = checkPageNumber.replace('p=', '');
      }
    }
    catch (err) {
    }


    var dup = Number(rankOrganic);
    dup = dup - 1; 

    if (!rankOrganic) {
      rankOrganic = 1;
    } else {
      rankOrganic = (dup * 18) + 1;
    }
    const urlProduct = document.querySelectorAll('ol[class="products list items product-items "]>li');
    for (let i = 0; i < urlProduct.length; i++) {
      addHiddenDiv('rankOrganic', rankOrganic++, i);
    }



// for rank
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
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

  // for rank
    const sliceURL = (data) => {
      var cnt = 0;
      for (let index = 0; index < data.length; index++) {
        if (data[0] != 0) {
          cnt++;
          addElementToDocument('altImages', cnt);
        }
      }
    };
    var backgroundURL = getAllXpath('//a[@class="product-item-link"]', 'nodeValue');
    sliceURL(backgroundURL);
  });
  //rank end
return await context.extract(productDetails, { transform });
}
