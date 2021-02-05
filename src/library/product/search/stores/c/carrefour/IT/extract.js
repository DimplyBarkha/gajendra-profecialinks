
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'carrefour',
    transform,
    domain: 'carrefour.it',
    zipcode: '',
  }};
  /*implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      
      /*if(document.querySelector('div.consent_btn-wrapper button.btn-secondary')){
        // @ts-ignore
        document.querySelector('div.consent_btn-wrapper button.btn-secondary').click();
      }
      while (document.querySelector('div.show-more div button')) {
        const element = document.querySelector('div.show-more div button');
        element.scrollIntoView();
        await new Promise(resolve => setTimeout(resolve, 1500));
        // @ts-ignore
        document.querySelector('div.show-more div button').click();
        await new Promise(resolve => setTimeout(resolve, 1500));
        let NoOFelementForBreak=document.querySelectorAll("div.product-item").length;
        
        // @ts-ignore
        if( NoOFelementForBreak=="150"){
          break;
        }
      }
    });
    try {
      await context.waitForXPath('//div[contains(@class,"product-item")]');
    } catch (error) {
      console.log('All products not loaded after scrolling!!');
    }
    return await context.extract(productDetails, { transform });
  },
};
*/
