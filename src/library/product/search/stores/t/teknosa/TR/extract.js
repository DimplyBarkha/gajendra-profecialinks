const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  function addEan () {
    const script = Array.from(
      document.querySelectorAll('script[type="text/javascript"]'),
    ).find((elm) => elm.textContent.includes('cd_product_ean'));
    const eanData = script.textContent.match(/cd_product_ean:([^\n]+)/)[1].trim().replace(/'/g, '"');
    const productEans = JSON.parse(eanData);
    Array.from(document.querySelectorAll('#product-item')).forEach((elm, index) => {
      const ean = productEans[index];
      elm.setAttribute('ean', ean);
    });
  }
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const a = await context.evaluate(addEan);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    transform,
    domain: 'teknosa.com',
    zipcode: '',
  },
  implementation,
};
