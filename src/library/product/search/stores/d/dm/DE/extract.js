const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    document.querySelectorAll('[data-dmid="product-tile-rating"]').forEach(elm => {
      const ratingStars = [...elm.querySelectorAll('img[data-dmid="filled-star"]')].map(rate => Number(rate.getAttribute('alt') ? rate.getAttribute('alt').match(/\d+/)[0] : '0'));
      const rating = ratingStars.reduce((a, b) => a + b, 0) / 100;
      const ratingValue = rating.toString().replace('.', ',');
      elm.setAttribute('rating', ratingValue);
    });
    document.querySelectorAll('div[data-dmid="product-description"]').forEach(elm => {
      const brand = elm.querySelector('span[data-dmid="product-brand"]');
      const name = elm.querySelector('a[data-dmid="dm-link"]').getAttribute('title');
      const size = elm.querySelector('a[data-dmid="dm-link"] > span');
      const brandName = brand.innerHTML;
      if (size.innerHTML.includes('...')) {
	      const fullName = brandName.concat(' ', name, ' ', size.innerHTML.replace(new RegExp('(.+,\\s)(\\d+\\s(ml|g|St|Wl|l))', 'g'), ', $2'));
        elm.setAttribute('name', fullName);
      } else {
	      const fullName = brandName.concat(' ', size.innerHTML);
	      elm.setAttribute('name', fullName);
      }
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    transform: transform,
    domain: 'dm.de',
  },
  implementation,
};
