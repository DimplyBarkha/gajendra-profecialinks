const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UAE',
    store: 'sephora',
    transform,
    domain: 'sephora.ae',
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

  const scrollFunc = await context.evaluate(async function () {
    let items = '//div[contains(@class, "search-result-content")]//li'
    var itemsCheck = document.evaluate( items, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if( itemsCheck.snapshotLength ) {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        // await stall(2500);
        // await new Promise(resolve => setTimeout(resolve, 5000));
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await new Promise(resolve => setTimeout(resolve, 5000));
  
        console.log("SCROLLING");
        if (scrollTop === 20000) {
          break;
        }
      }
    } 
  });

  return await context.extract(productDetails, { transform });
}