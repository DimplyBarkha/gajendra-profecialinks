
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'conforama.fr',
    timeout: 9000000,
    country: 'FR',
    store: 'conforama',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 9000000, waitUntil: 'load', checkBlocked: false });
    try {
      await context.waitForSelector('.g-recaptcha');
      await context.solveCaptcha({
        type: 'RECAPTCHA',
        // inputElement: '.g-recaptcha' rc-anchor-container
        inputElement: '#rc-anchor-container'
      }); 
    } catch (error) {
      
    }
    
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  // await context.waitForFunction(function (sel, xp) {
  //   return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
  // }, {"timeout":90000}, "div[id=\"product-detail-page\"]", "//div[@class=\"error\"]")
  },
  
};
