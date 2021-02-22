const { transform } = require('../../../../shared');
async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.waitForSelector('a[id="sel_country_close_pop"]', { timeout: 5000 });
    } catch (e) {
      console.log('popup not found');
    }
  
    await context.evaluate(async function () {
      const ageConfIframe = document.querySelector('a#sel_country_close_pop');
      if (ageConfIframe) {
        document.querySelector('a#sel_country_close_pop').click();
      }
      return !!ageConfIframe;
    });  
    return await context.extract(productDetails, { transform });
  }
  
  module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
      country: 'UK',
      store: 'JD_Sports',
      transform: transform,
      domain: 'jdsports.co.uk',
      zipcode: '',
    },
    implementation,
  };
  