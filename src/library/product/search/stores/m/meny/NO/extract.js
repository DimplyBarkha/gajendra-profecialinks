const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'meny',
    transform,
    domain: 'meny.no',
    zipcode: '',
  },
  // implementation: async function (
  //   inputs,
  //   parameters,
  //   context,
  //   dependencies,
  // ) {
  //   const { productDetails } = dependencies;
  //   const { transform } = parameters;
  //   await context.evaluate(async function(context) {
  //     const seeAllSelector = document.querySelector("div[id='ws-search-block-products']>button[class*='ws-link']");
  //     if (seeAllSelector) {
  //       console.log('See all selector found');
  //       seeAllSelector.click()
  //       console.log('See all selector clicked');
  //       await new Promise(resolve => { setTimeout(resolve, 20000) })
  //     }
      
  //   },context);
    
  //   return await context.extract(productDetails, { transform })
  // }

};
