// const { transform } = require('../../../../shared');
const { transform } = require('../format');


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
    zipcode: '',
  },
  implementation
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    // let noResultsXpath = '//h1//text()="0 Product results:"';
    //   var element = document.evaluate( noResultsXpath, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //   if( element.snapshotLength > 0 ) {
    //     throw new Error("notFound");
    //     }
      
    let scrollTop = 0;
    while (scrollTop !== 20000) {
      // await stall(2500);
      // await new Promise(resolve => setTimeout(resolve, 5000));
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("SCROLLING")
      if (scrollTop === 20000) {
        break;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  });




  return await context.extract(productDetails, { transform });
}