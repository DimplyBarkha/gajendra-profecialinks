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
while(!!document.querySelector('#search-result-items > div.gkk-search-results__infinite > button > font > font')){
document.querySelector('#search-result-items > div.gkk-search-results__infinite > button > font > font').click()
await new Promise(r => setTimeout(r, 6000));
}
})
return await context.extract(productDetails, { transform });
}
module.exports = {
implements: 'product/search/extract',
parameterValues: {
country: 'DE',
store: 'galeriakaufhof',
transform: transform,
domain: 'galeria.de',
},
implementation,
};





