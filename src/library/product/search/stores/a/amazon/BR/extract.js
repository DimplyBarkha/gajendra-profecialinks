const { transform } = require('../../../../transform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'amazon',
    transform,
    domain: 'amazon.com.br',
    zipcode: '',
  },
  implementation,

};
//   async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await context.evaluate(async function () {
//     const url = window.location.href;
//     function addElementToDocumentOld (key, value) {
//       const catElement = document.createElement('div');
//       catElement.id = key;
//       // catElement.textContent = value;
//       catElement.style.display = 'none';
//       document.body.appendChild(catElement);
//       if (Array.isArray(value)) {
//         const innerHTML = value.reduce((acc, val) => {
//           return `${acc}<li>${val}</li>`;
//         }, '<ul>') + '</ul>';
//         catElement.innerHTML = innerHTML;
//       } else {
//         catElement.textContent = value;
//       }
//       return catElement;
//     }
//     const getAllXpath = (xpath, prop) => {
//       const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//       const result = [];
//       for (let index = 0; index < nodeSet.snapshotLength; index++) {
//         const element = nodeSet.snapshotItem(index);
//         if (element) result.push(prop ? element[prop] : element.nodeValue);
//       }
//       return result;
//     };


//     const priceXpath = getAllXpath("//span[@class='price']/text()",'nodeValue').join('|');
//     var priceValue = priceXpath.split('|');

 
//   });
//   return await context.extract(productDetails, { transform });
// }