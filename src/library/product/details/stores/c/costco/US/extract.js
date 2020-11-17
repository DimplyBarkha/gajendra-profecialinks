const { transform } = require('../sharedTransform');
const { implementation } = require('../extractImplementation');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'costco',
    transform,
    domain: 'costco.com',
    zipcode: '94209',
  },
  implementation,

//   implementation: async (inputs,
//     parameters,
//     context,
//    dependencies,
//     ) => {
// await context.evaluate(async function () {


//  let sku = products[0].map(e => { return e.partNumber}).join(" | ")
//  document.body.setAttribute('variantId',sku);
//  }
 
// });
// const { productDetails } = dependencies;
// await context.extract(productDetails);
// },

};
