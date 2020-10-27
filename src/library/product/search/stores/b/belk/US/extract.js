const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve) => setTimeout(resolve, 5000));
  const isPopupPresent = await context.evaluate(async () => {
    return document.querySelector('div[id="monetate_lightbox_content_container"]');
  });
  
  if(isPopupPresent !== null) {
    await context.evaluate(() => {
      document.querySelector('div[id="monetate_lightbox_content_container"]').remove();
      document.querySelector('div[id="monetate_lightbox_mask"]').remove();
    });
  }

  var data = await context.extract(productDetails, { transform });

  for(let i=0;i<data[0].group.length;i++){

    if("thumbnail" in data[0].group[i]){
 
      for(let j=0;j<data[0].group[i].thumbnail.length;j++){
 
        if(data[0].group[i].thumbnail[j].text=='https://belk.scene7.com/is/image/Belk/defaultimage'){
          data[0].group[i].thumbnail.splice(j,1);
        }
      }
      if(data[0].group[i].thumbnail.length == 2){
        data[0].group[i].thumbnail.splice(1,1);
      }  
    }

    if("price" in data[0].group[i] && data[0].group[i].price.length == 2){
      data[0].group[i].price[0].text += ' - ' + data[0].group[i].price[1].text
      data[0].group[i].price.splice(1,1);
    }
  }
  return data;
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'belk',
    transform: null,
    domain: 'belk.com',
    zipcode: '',
  },
  implementation,
};
