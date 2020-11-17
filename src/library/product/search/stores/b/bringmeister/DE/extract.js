const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'bringmeister',
    transform: null,
    domain: 'bringmeister.de',
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

    //for rank
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="_1LP36"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let rankOrganic;
    // let url = window.location.href;
    // let checkPageNumber = url.split('offset=')[1];
    // // console.log('checkPageNumber----------',checkPageNumber)

    // // if (checkPageNumber != null) {
    // //   checkPageNumber = checkPageNumber.split("-")[0];
    // // }
    
    // try {
    //   if (checkPageNumber.endsWith('&utf')) {
    //     // console.log('rankorgani',rankOrganic)
    //     rankOrganic = checkPageNumber.replace('&utf', '');
    //     rankOrganic = Number(rankOrganic) / 36
    //     console.log('rankorgani',rankOrganic)
    //   }
    // }
    // catch (err) {
    // }


    // var dup = Number(rankOrganic);
    // dup = dup - 1; 

    if (!rankOrganic) {
      rankOrganic = 1;
    }
    // else {
    //   rankOrganic = (dup * 60) + 1;
    // }
    const urlProduct = document.querySelectorAll('div[class="_1LP36"]');
    for (let i = 0; i < urlProduct.length; i++) {
      console.log(i,'i=======================')
      addHiddenDiv('rankOrganic', rankOrganic++, i);
    }


    // Method to Retrieve Xpath content of a Single Node
    // var getXpath = (xpath, prop) => {
    //   var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    //   let result;
    //   if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
    //   else result = elem ? elem.singleNodeValue : '';
    //   return result && result.trim ? result.trim() : result;
    // };

    // var pagination = getXpath("li[class="item"]', 'nodeValue');
    // if (pagination === 'pagination__link') {
    //   addclass('ul.pagination li:last-child a');
    // };

    // for rank
    // function addElementToDocument(key, value) {
    //   const catElement = document.createElement('div');
    //   catElement.id = key;
    //   catElement.textContent = value;
    //   catElement.style.display = 'none';
    //   document.body.appendChild(catElement);
    // }

    // Method to Retrieve Xpath content of a Multiple Nodes
    // const getAllXpath = (xpath, prop) => {
    //   const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //   const result = [];
    //   for (let index = 0; index < nodeSet.snapshotLength; index++) {
    //     const element = nodeSet.snapshotItem(index);
    //     if (element) result.push(prop ? element[prop] : element.nodeValue);
    //   }
    //   return result;
    // };

    // for rank
    // const sliceURL = (data) => {
    //   var cnt = 0;
    //   for (let index = 0; index < data.length; index++) {
    //     if (data[0] != 0) {
    //       cnt++;
    //       addElementToDocument('altImages', cnt);
    //     }
    //   }
    // };
    // var backgroundURL = getAllXpath('//span[@class="product__name__productitemno"]/text()', 'nodeValue');
    // sliceURL(backgroundURL);
  });
  //rank end


  return await context.extract(productDetails, { transform });
}  
