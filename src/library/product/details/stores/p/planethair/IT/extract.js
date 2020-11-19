const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'planethair',
    transform: cleanUp,
    domain: 'planethair.it',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    
      var data = await context.extract(productDetails, { transform });
      for (let k = 0; k < data.length; k++) {
        for (let i = 0; i < data[k].group.length; i++) {
          if ('description' in data[k].group[i]) {
            var descrString = data[k].group[i].description[0].text;
            console.log('!!!!!!!!!');
            console.log(typeof(descrString));
            // descrString = descrString.split('Ingredien');
            // console.log('!!!!!!!!!');
            // console.log(descrString[1]);
          }
        }
      }
      return data;
  },
};
