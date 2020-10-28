const { transform } = require('../shared');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await context.evaluate(async function () {
//     let scrollTop = 0;
//     while (scrollTop !== 20000) {
//       await stall(500);
//       scrollTop += 1000;
//       window.scroll(0, scrollTop);
//       if (scrollTop === 20000) {
//         await stall(5000);
//         break;
//       }
//     }
//     function stall (ms) {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve();
//         }, ms);
//       });
//     }
//     function getElementsByXPath (xpath, type, parent) {
//       const results = [];
//       const query = document.evaluate(xpath, parent || document,
//         null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//       for (let i = 0, length = query.snapshotLength; i < length; ++i) {
//         if (type === 'Specifications') {
//           if (i % 2 === 0) {
//             results.push(query.snapshotItem(i).innerText + ' : ' + query.snapshotItem(i + 1).innerText);
//           }
//         }
//         if (type === 'Description') {
//           results.push(query.snapshotItem(i).innerText);
//         }
//       }
//       return results;
//     }
//     const specification = getElementsByXPath("//h4[contains(text(),'Specifications')]/following-sibling::div/dl/dt|//h4[contains(text(),'Specifications')]/following-sibling::div/dl/dd", 'Specifications').join(' || ');
//     const description = getElementsByXPath('//div[@class="ProductOverviewInformation-description"]', 'Description');
//     const feature = getElementsByXPath('//h4[contains(text(),"Features")]/following-sibling::ul/li', 'Description') ? 'Features : ' + getElementsByXPath('//h4[contains(text(),"Features")]/following-sibling::ul/li', 'Description').join(' || ') : '';
//     const ProductDetails = getElementsByXPath('//h4[contains(text(),"Product Details")]/following-sibling::ul/li', 'Description') ? 'Product Details : ' + getElementsByXPath('//h4[contains(text(),"Product Details")]/following-sibling::ul/li', 'Description').join(' || ') : '';
//     const included = getElementsByXPath('//h3[contains(text(),"Included?")]/following-sibling::ul/li', 'Description') ? 'What\'s Included? : ' + getElementsByXPath('//h3[contains(text(),"Included?")]/following-sibling::ul/li', 'Description').join(' || ') : '';
//     const descriptionArr = [description, included, feature, ProductDetails].filter(e => e).join(' || ');
//     document.body.setAttribute('description', descriptionArr);
//     document.body.setAttribute('specification', specification);
//   });
//   return await context.extract(productDetails, { transform });
// }

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    transform,
    domain: 'wayfair.com',
  },
  // implementation,
};
