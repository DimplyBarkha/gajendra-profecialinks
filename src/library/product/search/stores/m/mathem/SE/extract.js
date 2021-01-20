const { transform } = require('../../../../shared');
/**
 * @param {any} inputs
 * @param {{ transform: any; }} parameters
 * @param {{ waitForSelector?: any; click?: any; evaluate?: any; extract?: any; context?: any; }} context
 * @param {{ productDetails: any; }} dependencies
 */
async function implementation (
inputs,
parameters,
context,
dependencies,
) {
const { transform } = parameters;
const { productDetails } = dependencies;
const { waitForSelector } = context;
await context.waitForSelector('div[class="two-col"] div button[class="btn full-width"]');
await context.click('div[class="two-col"] div button[class="btn full-width"]');
await context.evaluate(async () => {
while(!!document.querySelector(("#content-main > mh-search-result > mh-tabs > mh-tab.active > mh-product-list > section > mathem-fetch-more-btn > section > button > i"))){
document.querySelector(("#content-main > mh-search-result > mh-tabs > mh-tab.active > mh-product-list > section > mathem-fetch-more-btn > section > button > i")).click()
await new Promise(r => setTimeout(r, 6000));
}
// const doesPopupExist = await context.evaluate(function () {
//   return Boolean(document.querySelector('div[class="two-col"] div button[class="btn full-width"]'));
// });

// if (doesPopupExist) {
//   await context.click('div[class="two-col"] div button[class="btn full-width"]');
// }
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
//  async function implementation(
//   inputs,
//   parameters,
//   context,
//   dependencies,
//   ) {
//     // const { transform } = parameters;
//     // const { productDetails } = dependencies;
// await context.waitForSelector('cookiesSelector');
// await context.click('cookiesSelector');
// await context.waitForSelector('pageFullyLoadedSelector');
//   }