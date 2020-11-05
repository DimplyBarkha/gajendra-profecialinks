const { transform } = require('../../../../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CZ',
    store: 'alza',
    transform,
    domain: 'alza.cz',
    zipcode: '',
  },

  implementation: async function  (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function()
    {
      var element = window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
      return element;
    })
    await context.waitForXPath('//div[@class="browsingitemcontainer"]/div[last()-1]//img/@srcset')
    
    return await context.extract(productDetails, { transform });
  }
  
};
