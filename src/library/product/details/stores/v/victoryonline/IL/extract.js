const { cleanUp } = require('../../../../shared.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'victoryonline',
    transform: cleanUp,
    domain: 'victoryonline.co.il',
    zipcode: '',
  },
  implementation: async function implementation (inputs, parameters, context, dependencies) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      if (document.querySelector('span.Price span.Coin') && document.querySelector('meta[itemprop="priceCurrency"]')) {
        document.querySelector('span.Price').textContent = document.querySelector('span.Price').textContent.replace(/₪/g, '') + ' ' + document.querySelector('meta[itemprop="priceCurrency"]').getAttribute('content');
      }
    });

    const categoryScriptString = await context.evaluate(() => {
      return document.evaluate('//script[contains(.,"Category")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    });

    const dataRef = await context.extract(productDetails, { transform });
    if (dataRef[0].group[0].sku) {
      if (/(\d+)/.test(dataRef[0].group[0].sku[0].text)) {
        dataRef[0].group[0].sku[0].text = dataRef[0].group[0].sku[0].text.match(/(\d+)/)[1];
      }
    }
    const regexp = /Category":"(.+?)"/
    if (categoryScriptString && regexp.test(categoryScriptString)) {
      dataRef[0].group[0].category = [{
        text: regexp.exec(categoryScriptString)[1],
      }];
    }
    return dataRef;
  },
};
