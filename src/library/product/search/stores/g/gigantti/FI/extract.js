const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { results } = inputs;
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const maxRecords = results ?  results : 150; // need to get from main action
  

  let scrollTop = 0;
  let recordsOnPage = 0; 
  //TODO: maxRecords should be updated based on max number of results on the page
  while (scrollTop !== 200000) { // TODO: need to update it for a selector for end of page
    if(recordsOnPage < maxRecords) {
    scrollTop = await context.evaluate(function(scrollTop){
      scrollTop += 10000;
      window.parent.scroll(0, scrollTop);
      return scrollTop;   
    },scrollTop);
    let btn = await context.evaluate(() => {return Boolean(!!document.querySelector('button.coi-banner__accept'))});
    if(btn){
      try{ 
      await context.click('button.coi-banner__accept');
      }
      catch(error){}
    }  
    recordsOnPage = await context.evaluate(() => {return document.querySelectorAll('div.mini-product') ? document.querySelectorAll('div.mini-product').length : -1});
    console.log(recordsOnPage);
    //if(recordsOnPage == recordsCollected) return -1;
     }
     if (scrollTop === 200000) { // TODO: need to update it for a selector for end of page
      break;
    } 
    }
    

  return await context.extract(productDetails, { transform });
  
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'gigantti',
    transform,
    domain: 'gigantti.fi',
    zipcode: '',
  },
  implementation
};
