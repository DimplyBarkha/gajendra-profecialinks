const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'noon',
    transform,
    domain: 'noon.com',
    zipcode: "''",
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    let enhancedContent = await context.evaluate(()=>{
      return Boolean(document.querySelector('div[class*="richContent"]'));
    });
    if(enhancedContent){
      await context.evaluate(()=>{
        document.querySelector('div[class*="richContent"]').scrollIntoView({behavior:"smooth"})
      });
      try{
        await context.waitForSelector('div[class*="richContent"] img');
      }catch(err){
        console.log('no enhanced content')
      }
    }
    return await context.extract(productDetails, { transform });
  }
  
};

