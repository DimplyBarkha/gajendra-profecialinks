
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PE',
    store: 'linio',
    transform: null,
    domain: 'linio.com',
    zipcode: '',
  },
  // implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
  //   await context.evaluate(async function () {
  //   function addElementToDocument(key, value) {
  //   const catElement = document.createElement('div');
  //   catElement.id = key;
  //   catElement.textContent = value;
  //   catElement.style.display = 'none';
  //   document.body.appendChild(catElement);
  //   }
  //   // Method to Retrieve Xpath content of a Multiple Nodes
  //   const getAllXpath = (xpath, prop) => {
  //   const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  //   const result = [];
  //   for (let index = 0; index < nodeSet.snapshotLength; index++) {
  //   const element = nodeSet.snapshotItem(index);
  //   if (element) result.push(prop ? element[prop] : element.nodeValue);
  //   }
  //   return result;
  //   };
  //   var getXpath = (xpath, prop) => {
  //   var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
  //   let result;
  //   if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
  //   else result = elem ? elem.singleNodeValue : '';
  //   return result && result.trim ? result.trim() : result;
  //   };
  //   var backgroundURL = getAllXpath('//span[@class="product-name"]//text()', 'nodeValue');
  //   var brand = getAllXpath('//a[@itemprop="brand"]//text()', 'nodeValue');
  //   // var brand1= brand.ignoreCase;
  //   var nameExptend;
  //   // @ts-ignore
  //   var ignoreCase = require('ignore-case');
  //     if (backgroundURL.includes('brand'.toUpperCase()) {
  //       nameExptend = backgroundURL
  //     }
  //     else{
  //       nameExptend = brand + ' ' + backgroundURL;
  //     }
  //   console.log(nameExptend,'----------------nameextend')
  //   addElementToDocument('nameExptend', nameExptend);
   
  // });
  // await context.extract(productDetails);
  // },
  };

