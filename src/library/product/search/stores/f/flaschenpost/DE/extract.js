const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    transform,
    domain: 'flaschenpost.de',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;       
        var wantedZip = '28203'; 
        await new Promise((resolve, reject) => setTimeout(resolve, 10000));
      await context.click('a[class="fp-changeZipCode fp-footer-changeZipCode"]');   
      await context.setInputValue('[id="validZipcode"]', wantedZip);
      await context.waitForSelector('button[class="fp-button fp-button--primary zip--button fontSizeL"]', 6000)
      await context.click('button[class="fp-button fp-button--primary zip--button fontSizeL"]');    
    
    return await context.extract(productDetails, { transform });
  },
}