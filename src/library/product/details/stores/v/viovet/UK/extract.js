const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // Check for noResultXpath
  const noResultXpath = await context.evaluate(async function () {
    const noXpath = document.evaluate('//h1[contains(text(), "did not match any products")] | //span[contains(text(), "Select a product")]',
      document, null, XPathResult.STRING_TYPE, null);
    if (noXpath.stringValue) {
      return noXpath.stringValue;
    }
  });
  if (noResultXpath) {
    console.log('No results were returned');
  } else {
    await context.evaluate(async function () {
      // Create product_url
      const productUrl = window.location.href;
      document.body.setAttribute('url', productUrl);
    });
    return await context.extract(productDetails, { transform });
  }
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'viovet',
    transform: cleanUp,
    domain: 'viovet.co.uk',
    zipcode: '',
  },
  implementation,
};
