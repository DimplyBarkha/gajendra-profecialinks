
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'placedestendances',
    transform: null,
    domain: 'placedestendances.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function() {
     
    if(document.querySelector('div.lien_voir_tout_container a'))
      {
        document.querySelector('div.lien_voir_tout_container a').click();
      
      }
      await new Promise(r => setTimeout(r,8000)) ;

    });
    return await context.extract(productDetails, { transform });
  },
};
