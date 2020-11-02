const { transform } = require('../shared');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   var variantLength = await context.evaluate(async () => {
//     return (document.querySelectorAll('div.rd__blob')) ? document.querySelectorAll('div.rd__blob').length : 0;
//   });
//   console.log("variantLength:: ", variantLength);
//   if (variantLength > 1) {
//     // await preparePageForCommonElement(0, variantLength);
//     for (let j = 0; j < variantLength; j++) {
//       await context.evaluate(async (j) => {
//         return document.querySelectorAll('div.rd__blob h2')[j].click();
//       }, j);
//       // await context.click(`ul.topic li label`);
//       console.log('Inside variants', j);
//       // await preparePage(j, variantLength);
//       if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
//     }
//   }
//   return await context.extract(productDetails, { transform });
// }
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'douglas',
    transform,
    domain: 'douglas.es',
    zipcode: '',
  },
  //implementation,
};
