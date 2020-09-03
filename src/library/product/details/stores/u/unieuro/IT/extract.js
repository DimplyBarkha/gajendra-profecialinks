const { transform } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  async function getEnhancedContentScript () {
    const flixData = document.querySelector('[data-module="productdetail"]');
    if (!flixData) return;
    const ean = flixData.getAttribute('data-productdetail-productean');
    const flixCode = flixData.getAttribute('data-productdetail-flixcode');
    const locale = 'it';
    const enhancedLink = `https://media.flixcar.com/delivery/js/inpage/${flixCode}/${locale}/ean/${ean}`;
    const response = await fetch(enhancedLink);
    const data = await response.text();
    // eslint-disable-next-line no-eval
    eval(data);
    return data;
  }
  await context.evaluate(getEnhancedContentScript);

  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    transform,
    domain: 'unieuro.it',
    zipcode: '',
  },
};
