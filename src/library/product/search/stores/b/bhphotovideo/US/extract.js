const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const windowScroll = await context.evaluate(async () => {
    for(let i=0;i<=document.body.scrollHeight;i=i+500){
      window.scroll(0,i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
  
  var data = await context.extract(productDetails, { transform });

  for(let i=0;i<data[0].group.length;i++){
    if("price" in data[0].group[i]){
      if(data[0].group[i].price.length==2){
        data[0].group[i].price[0].text += '.' + data[0].group[i].price[1].text;
        data[0].group[i].price.splice(1,1);
      }
    }
  }

  return data;

}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'bhphotovideo',
    transform: null,
    domain: 'bhphotovideo.com',
    zipcode: '',
  },
  implementation,
};
