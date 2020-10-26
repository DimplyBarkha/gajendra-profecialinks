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
    if("thumbnail" in data[0].group[i]){
      for(let j=0;j<2;j++){
        if(data[0].group[i].thumbnail[j].text=='https://belk.scene7.com/is/image/Belk/defaultimage'){
        data[0].group[i].thumbnail.splice(j,1);
        }
      }
      if(data[0].group[i].thumbnail.length == 2){
        data[0].group[i].thumbnail.splice(1,1);
      }   
    }
  }

  return data;
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'belk',
    transform,
    domain: 'belk.com',
    zipcode: '',
  },
  implementation,
};
