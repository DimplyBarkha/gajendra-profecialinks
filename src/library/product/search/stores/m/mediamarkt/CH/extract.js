
const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    // @ts-ignore
    const currency = document.querySelector('div.price-range-slider + div > label').innerText;
    const allProducts = document.querySelectorAll('ul.products-list > li:not([class])');
    allProducts.forEach((product, index) => {
      const pictureUrl = `https:${product.querySelector('aside.product-photo > figure > a > img').getAttribute('src')}`;
      const rating = product.querySelector('div.rating > div').getAttribute('class').match(/-(\d(-\d)?)/)[1].replace('-', '.');
      // @ts-ignore
      const price = product.querySelector('div.price-box > div').innerText.replace(/\n/g, '');
      product.setAttribute('product-picture', pictureUrl);
      product.setAttribute('product-price', `${price} ${currency}`);
      product.setAttribute('product-rating', rating);
    });

    const productUrl = document.querySelectorAll('h2 > a');
    const prefix = 'https://www.mediamarkt.ch';

    productUrl.forEach((element) => {
      element.setAttribute('product-url', prefix.concat(element.getAttribute('href')));
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.ch/fr',
    zipcode: "''",
  },
  implementation,
};
