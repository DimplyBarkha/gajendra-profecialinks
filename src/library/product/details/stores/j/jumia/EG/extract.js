const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'EG',
    store: 'jumia',
    transform,
    domain: 'jumia.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      // const { transform } = parameters;
      if (document.querySelector('div[id="catalog-listing"]')) { // checking if a listing page
        console.log('we are on listing page');
        if (document.querySelector('div[class*="-paxs row"]') && document.querySelector('div[class*="-paxs row"] article[class*="prd"]')) {
          console.log('we are inside listing div');
          document.querySelector('div[class*="-paxs row"] article[class*="prd"] a[class*="core"]').click();
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
