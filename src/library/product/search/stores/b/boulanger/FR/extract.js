
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
    // is popup present?
    const divSelector = document.querySelector('div#privacy-overlay');
    if (divSelector) {
      divSelector.remove();
      document.querySelector('div#privacy-container').remove();
    }
    // Creating searchUrl and rank/rankOrganic
    const allProducts = document.querySelectorAll('div.productListe > div');
    let x;
    for (x = 0; allProducts.length - 1 >= x; x++) {
      const locationHref = window.location.href;
      allProducts[x].setAttribute('count', `${x + 1}`);
      allProducts[x].setAttribute('href', locationHref);
    }
    // Creating aggregateRating
    const ratingSelector = document.querySelectorAll('p.rating.orange');
    if (ratingSelector) {
      ratingSelector.forEach(element => {
        const ratingRegex = /\d+/;
        const matchedRegex = element.getAttribute('class').match(ratingRegex);
        if (matchedRegex[0]) {
          const properRating = matchedRegex[0].match(/\d{1}/g).join(',');
          if (properRating) {
            element.setAttribute('rating', properRating);
          }
        }
      });
    }
    // fix for not loading thumbnails
    let scrollTop = 0;
    while (scrollTop !== 15000) {
      await stall(1000);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 15000) {
        await stall(1000);
        break;
      }
    }
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    transform,
    domain: 'boulanger.com',
    zipcode: '',
  },
  implementation,
};
