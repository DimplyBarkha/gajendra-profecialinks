const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'binglee',
    transform: transform,
    domain: 'binglee.com.au',
    zipcode: '',
  }, implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {

      const allScriptNodes = document.querySelectorAll('script[type="application/ld+json"]');
      let scriptText = "";
      allScriptNodes.forEach(q => {
        if (q.textContent && q.textContent.includes('identifier')) {
          scriptText = q.textContent;
        }
      });
      if (scriptText) {
        scriptText = JSON.parse(scriptText);
        if (scriptText.identifier) {
          document.body.insertAdjacentHTML('afterbegin', `<div id="prodVarId" style="display: hidden">${scriptText.identifier}</div>`)
        }
      }
    });
    try {
      await context.waitForSelector('section#cbar_widget0', { timeout: 100000 });
    } catch (e) {
      console.log('related products not found');
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  }
};
