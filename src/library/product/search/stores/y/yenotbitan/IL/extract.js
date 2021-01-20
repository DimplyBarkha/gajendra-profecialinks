const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'yenotbitan',
    transform,
    domain: 'ybitan.co.il',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    let count = document.querySelectorAll('div.search-products-wrapper div.items > div.item.product').length;
    while (count <= 150) {
      if (document.querySelector('div.loading-wrapperivScrollContainer')) {
        document.querySelector('div.loading-wrapper').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        count = document.querySelectorAll('div.search-products-wrapper div.items > div.item.product').length;
      } else {
        break;
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
