const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'sephora',
    transform,
    domain: 'sephora.com.au',
    zipcode: '',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));

    // const itemUrl = await context.evaluate(function() {
      // let resultsCheck = '(//h1//text()[not(parent::b)])[1]'
      // var checkResults = document.evaluate( resultsCheck, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      // if(checkResults.snapshotLength > 0){
      //   let checkNone = checkResults.snapshotItem(0).textContent;
      //   if(checkNone === "0 Product results:"){
      //     throw new Error("notFound");
      //   }
      // }

    //   let itemCheck = '//div[contains(@class, "products-grid")]//div[contains(@class, "product-item")]//a'
    //   var checkElement = document.evaluate( itemCheck, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //   if( checkElement.snapshotLength > 0 ) {
    //     let url = checkElement.snapshotItem(0).href
    //     let splits = url.split("&")
    //     return splits[0]
    //   } else {
    //     return null
    //   }
    // })
    // if(itemUrl){
    //   await context.goto(itemUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    // }
    await new Promise(resolve => setTimeout(resolve, 10000));

      return await context.extract(productDetails, { transform: transformParam });
    },
};
