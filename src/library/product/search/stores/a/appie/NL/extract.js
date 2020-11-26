const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'appie',
    transform,
    domain: 'appie.nl',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

      await context.evaluate(()=>{const nextBtn = document.querySelector('#start-of-content > div.f-load-more > button');
      if (nextBtn) {
        nextBtn.click();
        console.log('button clicked');
      }})
    return await context.extract(productDetails, { transform });
}
};
