const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'apotekhjartat',
    transform,
    domain: 'apotekhjartat.se',
    zipcode: '',
    
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function() {
      window.location.reload();
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(8000);
          break;
        }
      }
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }            
    })
    await context.waitForSelector('div[class="row showMore text-center"]>div[class="hitCount"]',{timeout: 10000});
    await context.waitForNavigation({ timeout:50000});
    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });  
  },
};
