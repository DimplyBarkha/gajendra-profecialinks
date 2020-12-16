const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'instacart',
    transform,
    domain: 'instacart.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
     let othersellerName = document.evaluate(`//main[@id="main-content"]/div[contains(@class, 'rmq')]/div[contains(@class, 'rmq')]/section[2]/div/div[1]/h3 | //main[@id="main-content"]/div[contains(@class, 'rmq')]/div[contains(@class, 'rmq')]/section[1]/a[contains(.,'Shop similar items at')]`, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
     if(othersellerName) {
       document.body.setAttribute('othersellername', othersellerName.textContent.replace('Shop similar items at ',""));
     }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
