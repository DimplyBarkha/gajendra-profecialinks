const { transform } = require('../../../../shared');
async function implementation(
inputs,
parameters,
context,
dependencies,
) {
const { transform } = parameters;
const { productDetails } = dependencies;
await context.evaluate(async () => {
while(!!document.querySelector('div.scrolllist-pager-notification > div.button-container > span')){
document.querySelector('div.scrolllist-pager-notification > div.button-container > span').click()
await new Promise(r => setTimeout(r, 6000));
}
})
return await context.extract(productDetails, { transform });
}
module.exports = {
implements: 'product/search/extract',
parameterValues: {
country: 'GR',
store: 'hondoscenter',
transform: transform,
domain: 'hondoscenter.com',
},
implementation,
};