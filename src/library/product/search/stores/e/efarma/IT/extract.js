const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // Do a pagination with click more results button
  await context.evaluate(async function () {
    let moreProducts = document.querySelector('div.clerk-load-more-button');
    let allProducts = document.querySelectorAll('li.clerk-grid-item.item');
    if (moreProducts) {
      do {
        // @ts-ignore
        moreProducts.click();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        moreProducts = document.querySelector('div.clerk-load-more-button');
        allProducts = document.querySelectorAll('li.clerk-grid-item.item');
        // Break if is more or equal to 150 results
        if (allProducts.length >= 150) {
          break;
        }
      } while (moreProducts);
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'efarma',
    transform,
    domain: 'efarma.com',
    zipcode: '',
  },
  implementation,
};
