const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    // Create sku, gtin and brand
    const scriptXpath = document.evaluate('//script[contains(text(), "sku")]', document, null, XPathResult.STRING_TYPE, null);
    if (scriptXpath.stringValue) {
      const obj = JSON.parse(scriptXpath.stringValue);
      const sku = obj.sku;
      const gtin = obj.gtin13;
      const brand = obj.brand.name;
      document.body.setAttribute('sku', sku);
      document.body.setAttribute('gtin', gtin);
      document.body.setAttribute('brand', brand);
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'monoprix',
    transform: cleanUp,
    domain: 'monoprix.fr',
    zipcode: '',
  },
  implementation,
};
