const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'voiila',
    transform,
    domain: 'voila.ca',
  
  },implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const url = window.location.href;
      const sku = url.replace(/(.+)products\/(.+)\/details/g,'$2');
      if(sku){
        document.body.setAttribute('sku',sku);
      }
      if(url){
        document.body.setAttribute('url',url);
      }
      var imageData = window.__INITIAL_STATE__.data.products.productEntities;
      var imageArr  = imageData[Object.keys(imageData)] && imageData[Object.keys(imageData)].images;
      if(imageArr && imageArr.length){
        imageArr.forEach(element => {
          let newlink = document.createElement('a');
          newlink.setAttribute('class', 'image');
          newlink.setAttribute('href', element.src);
          document.body.appendChild(newlink);
        });
      }
   
     
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
