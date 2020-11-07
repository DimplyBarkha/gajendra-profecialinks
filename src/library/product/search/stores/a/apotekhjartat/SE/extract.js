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
      setTimeout(function(){window.location.reload()},3000);
    })
    await context.waitForSelector('div[class="row showMore text-center"]>div[class="hitCount"]',{timeout: 10000});
    await context.waitForNavigation({ timeout:50000});
    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });  
  },
};
