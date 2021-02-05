const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    transform: cleanUp,
    domain: 'jpg.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForSelector('div[class="col"]', 6000)    
    await context.evaluate(async () => {
      try {
        // @ts-ignore
      document.querySelector('button[id=onetrust-accept-btn-handler]').click()
      await new Promise(r => setTimeout(r, 6000));
      } catch (error) {
        
      } 
    
    });
 
      return await context.extract(productDetails, { transform });
  
    },
};