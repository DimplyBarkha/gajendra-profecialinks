
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'backmarket.fr',
    timeout: 900000,
    country: 'FR',
    store: 'backmarket',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 90000, waitUntil: 'load', checkBlocked: true });
    try {
      await context.evaluate(async function () {
        let notLoaded = document.evaluate('//h3[contains(text(), "pas été trouvée. ")] | //h3[contains(text(), "- Ce lien n’a pas encore été reconditionné")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if(notLoaded){
         throw "PAGE NOT FOUND !!";
        }
      })
    } catch (error) {
      console.log('error: ', error); 
    }
    
  },
};
