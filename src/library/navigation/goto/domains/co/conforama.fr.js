
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'conforama.fr',
    timeout: 90000,
    country: 'FR',
    store: 'conforama',
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
        }); 
      }

    } catch (error) {
      
    }
    
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  },
  
};
