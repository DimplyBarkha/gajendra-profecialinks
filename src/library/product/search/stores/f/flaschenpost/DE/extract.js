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
    // await context.evaluate(async () => {
      // const usernameElements = document.querySelector('input#validZipcode');     
      await context.setInputValue('[id="validZipcode"]', wantedZip);
      await context.waitForSelector('button[class="fp-button fp-button--primary zip--button"]', 6000)
      await context.click('button[class="fp-button fp-button--primary zip--button"]');    
    
    return await context.extract(productDetails, { transform });
  },
}