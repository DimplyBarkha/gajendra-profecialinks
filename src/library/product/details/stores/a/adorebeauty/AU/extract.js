const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'adorebeauty',
    transform,
    domain: 'adorebeauty.com.au',
    zipcode: '',
  }, implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const getBulletsPoint =  document.querySelectorAll('div[itemprop="description"] ul li');
      if(getBulletsPoint.length){
       getBulletsPoint.forEach((ele)=> ele.textContent = `|| ${ele.textContent}` );
      }
      const availabilityStatus = document.evaluate('//strong[@class="stock-message__info"]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;
      if (availabilityStatus.includes('Out')) {
          document.querySelector('h1.product-name').setAttribute('availability','Out of Stock');
      }else{
          document.querySelector('h1.product-name').setAttribute('availability','In Stock');
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
