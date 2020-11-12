const { transform } = require('../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'petsmart.ca',
    transform,
    domain: 'petsmart.ca',
    zipcode: '',
  },
implementation: async (inputs,
       parameters,
       context,
      dependencies,
       ) => {
         
  await context.evaluate(async function () {
    let getdescription = document.querySelector("#react-tabs-0");
    if(getdescription) { 
    getdescription.click();
    let descriptions = document.querySelector('div.react-tabs__tab-content > p') ? document.querySelector('div.react-tabs__tab-content > p').innerText.trim() : null;   
    document.body.setAttribute('description',descriptions);
    }


    let getingredient = document.querySelector("#react-tabs-2");
    if(getingredient) { 
    getingredient.click();
    let nutritional_info = document.querySelector('div.react-tabs__tab-content > p') ? document.querySelector('div.react-tabs__tab-content > p').innerText.trim() : null;
    document.body.setAttribute('nutritionInfo',nutritional_info);
    }


    let getdirection = document.querySelector("#react-tabs-4");
    if(getdirection) { 
    getdirection.click();
    let direction = document.querySelector('div.react-tabs__tab-content') ? document.querySelector('div.react-tabs__tab-content').innerText.trim() : null;
    document.body.setAttribute('directions',direction);
    }
    
  });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
},

}; 