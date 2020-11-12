const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(function () {
    // Getting price
    const priceXpath = document.evaluate('(//span[@data-price])[1]', document, null, XPathResult.STRING_TYPE, null);
    if (priceXpath.stringValue !== '') {
      document.body.setAttribute('price', priceXpath.stringValue);
    }
    // Getting listPrice
    const listPriceXpath = document.evaluate('(//span[@data-price-old])[1]', document, null, XPathResult.STRING_TYPE, null);
    if (listPriceXpath.stringValue !== '') {
      document.body.setAttribute('listprice', listPriceXpath.stringValue);
    }
    // Creating availabilityText
    // @ts-ignore
    const availabilitySelector = [...document.querySelectorAll('span')].map(span => span.innerHTML)
      .filter(txt => txt.includes('Add to cart'));
    if (availabilitySelector.length > 0) {
      document.body.setAttribute('availability', 'In Stock');
    } else if (availabilitySelector.length === 0) {
      document.body.setAttribute('availability', 'Out of Stock');
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'KE',
    store: 'jumia',
    transform: cleanUp,
    domain: 'jumia.co.ke',
    zipcode: '',
  },
  implementation,
};
