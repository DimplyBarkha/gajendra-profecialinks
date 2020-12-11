const { transform } = require('../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse_Mweb',
    transform,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
   async function nextLink() {
    let nextLinkSelector = await context.evaluate(() => 
    !!document.querySelector('div[class*="search__result__products"] + div[class*="search__result__pager"] button[class*="active search__result"] + button')
   );
   while(nextLinkSelector){
    await context.extract(productDetails, { transform }, { type: 'APPEND' });
     await context.click('div[class*="search__result__products"] + div[class*="search__result__pager"] button[class*="active search__result"] + button');
     await new Promise(resolve => setTimeout(resolve, 2000));
   nextLinkSelector = await context.evaluate(() => 
    !!document.querySelector('div[class*="search__result__products"] + div[class*="search__result__pager"] button[class*="active search__result"] + button')
   );
   }
   }
   await nextLink();
  return await context.extract(productDetails, { transform });
}