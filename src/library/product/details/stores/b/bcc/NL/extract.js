const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    transform,
    domain: 'bcc.nl',
  }, implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
     const getBulletsPoint =  document.querySelectorAll('div[data-title="Productinformatie"] ul li');
     if(getBulletsPoint.length){
      getBulletsPoint.forEach((ele)=> ele.textContent = `|| ${ele.textContent}` );
     }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
