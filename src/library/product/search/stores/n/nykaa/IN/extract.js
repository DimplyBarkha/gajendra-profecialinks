const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    transform: transform,
    domain: 'nykaa.com',
    zipcode: '',
  },
  implementation: async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
    ) {
    
    const viewMore = '.view-more-btn.common-btn';
    
    await context.evaluate(scroll);
    async function scroll(){
      //const result = await context.evaluate((viewMore) => {
        //return Boolean(document.querySelector(viewMore));
      //},viewMore);
      for(let i=0;i<3;i++)
      {
        //if(true)
        //{
          setTimeout(function(){
            let footer = document.querySelector('.footer');
            footer.scrollIntoView({behavior:"smooth"});
          },10000)
          setTimeout(function(){
            let header = document.querySelector('#headerWpr');
        header.scrollIntoView({behavior:"smooth"});
          },10000)
        
        
        //scroll();
        //}
        //else{
        //return;
        //}
        }
      }
      
      const { transform } = parameters;
      const { productDetails } = dependencies;
      return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' }); 
    }
    
};
