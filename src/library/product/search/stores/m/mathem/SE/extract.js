const { transform } = require('../../../../shared');
async function implementation (
inputs,
parameters,
context,
dependencies,
) {
const { transform } = parameters;
const { productDetails } = dependencies;
await context.evaluate(async () => {
while(!!document.querySelector(("#content-main > mh-search-result > mh-tabs > mh-tab.active > mh-product-list > section > mathem-fetch-more-btn > section > button > i"))){
document.querySelector(("#content-main > mh-search-result > mh-tabs > mh-tab.active > mh-product-list > section > mathem-fetch-more-btn > section > button > i")).click()
await new Promise(r => setTimeout(r, 6000));
}
})
return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'mathem',
    transform: transform,
    domain: 'mathem.se',
    zipcode: '',
  },
  implementation
 };
