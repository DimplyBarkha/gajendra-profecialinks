const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'carrefour',
    transform,
    domain: 'carrefour.it',
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
  await context.evaluate(async function () {
    try{
   if(document.querySelector('div.vex-content main div.consent_btn-wrapper button.btn-primary')){
    // @ts-ignore
    document.querySelector('div.vex-content main div.consent_btn-wrapper button.btn-primary').click();
   }}
   catch(e){
     console.log("error ,",e);
   }
  });
  return await context.extract(productDetails, { transform });
}