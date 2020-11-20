const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'cromwell',
    transform: transform,
    domain: 'cromwell.co.uk',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(async () => {
      const variantTab = document.evaluate("//div[@class='ProductTabs']//div[contains(@class, 'product-details')]//ul[contains(@class, 'react-tabs')]//li[contains(text(), 'Product Variants')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (variantTab && variantTab.singleNodeValue) {
        variantTab.singleNodeValue.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
