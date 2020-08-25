
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.fr',
    timeout: 90000,
    country: 'FR',
    store: 'carrefour',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 90000, waitUntil: 'load', checkBlocked: false, first_request_timeout: 90000});
    try {
      // await context.waitForSelector('.g-recaptcha');
      const hasCaptcha = await context.evaluate(function (xp) {
        const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        console.log(xp, r);
        const e = r.iterateNext();
        console.log(e);
        return !e;
      }, '//*[@class="g-recaptcha"]');

      if(hasCaptcha){
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: '.g-recaptcha'
          // inputElement: '#rc-anchor-container'
        }); 
      }

    } catch (error) {
      
    }
    
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  // await context.waitForFunction(function (sel, xp) {
  //   return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
  // }, {"timeout":90000}, "div[id=\"product-detail-page\"]", "//div[@class=\"error\"]")
  },
  };
