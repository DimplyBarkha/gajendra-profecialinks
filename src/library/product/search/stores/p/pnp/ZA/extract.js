
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    // Creating Rank/RankOrganic and searchUrl
    const searchUrl = window.location.href;
    const allProducts = document.querySelectorAll('ul.col-md-12.product-listing.product-grid.product-grid > div > div');
    for (let x = 0; allProducts.length - 1 >= x; x++) {
      allProducts[x].setAttribute('count', `${x + 1}`);
      allProducts[x].setAttribute('searchurl', searchUrl);
    }
    // Adding , separator to price
    const allProductsPrice = document.querySelectorAll('div.currentPrice  ');
    allProductsPrice.forEach(element => {
      const elementSpan = element.querySelector('span');
      if (elementSpan) {
        const priceSeparator = elementSpan.innerText.replace(/^/, ',');
        elementSpan.innerText = priceSeparator;
      }
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ZA',
    store: 'pnp',
    transform,
    domain: 'pnp.co.za',
    zipcode: '',
  },
  implementation,
};
