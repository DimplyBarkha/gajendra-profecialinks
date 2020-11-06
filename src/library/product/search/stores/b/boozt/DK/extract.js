const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  var data = await context.extract(productDetails, { transform });
  
  for(let i=0;i<data[0].group.length;i++){
    if(data[0].group[i].price){
      if(data[0].group[i].price[0].text.includes('fra')){
        data[0].group[i].price[0].text = data[0].group[i].price[0].text.replace(/fra /, '');
      }
    }
  }

  return data;
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'boozt',
    transform: null,
    domain: 'boozt.com',
    zipcode: '',
  },
  implementation,
};
