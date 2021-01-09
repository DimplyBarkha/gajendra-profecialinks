const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'aptekaolmed',
    transform,
    domain: 'aptekaolmed.pl',
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
  const applyScroll = async function (context) {
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 1000) {
      scrollTop += 500;
      window.scroll(0, scrollTop);
      await stall(1000);
    }
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  })
}
  await applyScroll(context);
  
  await context.evaluate(async function () {
    function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
        }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="product-info"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
        // Method to Retrieve Xpath content of a Multiple Nodes
    function getAllXpath(xpath, prop) {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element)
          result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    }
        var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
        };
        var product_url=''
        var backgroundURL1 = getXpath('//a[@class="product-name"]/@href', 'nodeValue');
        console.log(backgroundURL1,'===========backgroundURL1')
        var backgroundURL = getXpath('//meta[@property="og:url"]/@content', 'nodeValue');
        if (backgroundURL1 == null){
          product_url= backgroundURL
          addElementToDocument('product_url', product_url);
        }
        else{
          const aggregateRating = document.querySelectorAll("a[class='product-name']")
          console.log(aggregateRating.length,'---------------------',aggregateRating)
          for (let k = 0; k < aggregateRating.length; k++) {
            product_url= 'https://www.aptekaolmed.pl'+aggregateRating[k].getAttribute("href");
            addHiddenDiv('product_url', product_url, k);
          }

        }
        
      
});
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}



// async function implementation(
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await context.evaluate(async function () {
//     let scrollTop = 0;
//     while (scrollTop !== 1000) {
//       await stall(500);
//       scrollTop += 500;
//       window.scroll(0, scrollTop);
//       if (scrollTop === 1000) {
//         await stall(500);
//         break;
//       }
//     }
//     function stall(ms) {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve();
//         }, ms);
//       });
//     }
//         function addElementToDocument(key, value) {
//         const catElement = document.createElement('div');
//         catElement.id = key;
//         catElement.textContent = value;
//         catElement.style.display = 'none';
//         document.body.appendChild(catElement);
//         }
//         // Method to Retrieve Xpath content of a Multiple Nodes
//         const getAllXpath = (xpath, prop) => {
//         const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//         const result = [];
//         for (let index = 0; index < nodeSet.snapshotLength; index++) {
//         const element = nodeSet.snapshotItem(index);
//         if (element) result.push(prop ? element[prop] : element.nodeValue);
//         }
//         return result;
//         };
//         var getXpath = (xpath, prop) => {
//         var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
//         let result;
//         if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
//         else result = elem ? elem.singleNodeValue : '';
//         return result && result.trim ? result.trim() : result;
//         };
//         var backgroundURL = getAllXpath('//meta[@property="og:url"]/@content', 'nodeValue');
//         console.log('backgroundURL++++++',backgroundURL)
//         // var brand = getAllXpath('//a[@itemprop="brand"]//text()', 'nodeValue');
// });
//   return await context.extract(productDetails, { transform });
// }

