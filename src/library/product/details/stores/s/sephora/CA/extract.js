
const { transform } = require('../CA/format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.evaluate(() => {
      Array.from(document.querySelectorAll('[data-at="sku_item_brand"],[data-at="product_brand_label"]')).forEach(elm => elm.innerText = elm.innerText + ' ');
    });
  } catch (err) {
    console.log('Error adding UPDP spacing');
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    transform,
    domain: 'sephora.ca',
    zipcode: '',
  },
  implementation
};
