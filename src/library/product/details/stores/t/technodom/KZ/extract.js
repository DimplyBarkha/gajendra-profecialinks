const {transform}=require('../KZ/format.js')
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try{
    console.log('comming for xpath');
    await context.waitForSelector('a.ProductCard-Content');
    console.log('comming for click');
    let tmphref= await context.evaluate(function(){
      return document.querySelector('a.ProductCard-Content').href;
    });
    console.log('tmphref:',tmphref);
    await context.goto(tmphref);
    await context.waitForNavigation();
  }catch(e){
    console.log('................................commint to error..................');
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'KZ',
    store: 'technodom',
    transform,
    domain: 'technodom.kz',
    zipcode: '',
  },
};
