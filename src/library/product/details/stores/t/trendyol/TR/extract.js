const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'trendyol',
    transform,
    domain: 'trendyol.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const variantCount = await context.evaluate(async function () {
      return document.querySelectorAll('div.pr-in-at-sp > div.sp-itm').length;
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
    for (let index = 2; index <= variantCount; index++) {
      try {
        await context.click(`div.pr-in-at-sp > div.sp-itm:nth-child(${index})`);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (variantCount !== index) {
          await context.extract(productDetails, { type: 'APPEND', transform  });
        } else {
          return await context.extract(productDetails, { type: 'APPEND', transform  });
        }
      } catch (error) {
        console.log('Error While itrerating over the variants',error);
      }
    }
   try{
    let node = await context.evaluate(async function () {
      return document.querySelectorAll(`button[id='confirmed']`);
    });
   
    if(JSON.stringify(node) !== '{}'){
      await context.click(`button[id='confirmed']`);
      await new Promise(resolve => setTimeout(resolve, 90000));
    }
    
   }catch(exception){
      console.log("Exception ",exception);
   }
  },
};
