const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    transform: cleanUp,
    domain: 'eldorado.ru',
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
      const originalDiv = document.querySelectorAll('li[data-dy="product"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    // for rating
    function addHiddenDiv1(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('span[class="tevqf5-0 cbJQML"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let rankOrganic;
    let count;
    let url = window.location.href;
    let checkPageNumber = url.split('offset=')[1];
    // console.log('checkPageNumber----------',checkPageNumber)

    // if (checkPageNumber != null) {
    //   checkPageNumber = checkPageNumber.split("-")[0];
    // }
    
    try {
      if (checkPageNumber.endsWith('&utf')) {
        // console.log('rankorgani',rankOrganic)
        rankOrganic = checkPageNumber.replace('&utf', '');
        rankOrganic = Number(rankOrganic) / 36
        console.log('rankorgani',rankOrganic)
      }
    }
    catch (err) {
    }


    var dup = Number(rankOrganic);
    dup = dup - 1; 

    if (!rankOrganic) {
      rankOrganic = 1;
    } else {
      rankOrganic = (dup * 36) + 37;
    }
    const urlProduct = document.querySelectorAll('li[data-dy="product"]');
    for (let i = 0; i < urlProduct.length; i++) {
      addHiddenDiv('rankOrganic', rankOrganic++, i);
    }
    var parent = document.querySelector(".tevqf5-0 cbJQML");
    var nodesSameClass = parent.querySelectorAll(".tevqf5-2 fBryir");
    console.log(nodesSameClass.length);

    var children = document.querySelectorAll('.tevqf5-0 cbJQML .tevqf5-2 fBryir');
    // count = 1;
    // const urlProduct1 = document.querySelectorAll('span[class="tevqf5-0 cbJQML"]');
    // console.log(urlProduct1,'urlProduct1-------------------')
    // for (let i = 0; i < urlProduct1.length; i++) {
    //   count= count + 1;
    //   addHiddenDiv1('rating', count);
    // }


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
