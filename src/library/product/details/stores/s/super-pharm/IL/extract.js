const {transform}=require('../IL/format')
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
    await context.waitForSelector('div#results-boxes>a');
    console.log('comming for click');
    //await context.click('div#results-boxes>a',{timeout:500});
    //context.waitForNavigation();
    //await context.click('div#results-boxes>a');
    let tmphref= await context.evaluate(function(){
      return document.querySelector('div#results-boxes>a').href;
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
    country: 'IL',
    store: 'super-pharm',
    transform,
    domain: 'super-pharm.co.il',
    zipcode: '',
  },
  implementation
};
