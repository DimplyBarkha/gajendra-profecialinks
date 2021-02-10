const { transform } = require('../../../../shared');
module.exports = {
implements: 'product/search/extract',
parameterValues: {
country: 'UK',
store: 'JDSports',
transform,
domain: 'jdsports.co.uk',
zipcode: '',
},
implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
await context.evaluate(async () => {
try {
// @ts-ignore
document.querySelector('div[class="closebutsec"]').click();
// eslint-disable-next-line promise/param-names
await new Promise(r => setTimeout(r, 4000));
} catch (error) {
}
});
return await context.extract(productDetails, { transform: transformParam });
},
};