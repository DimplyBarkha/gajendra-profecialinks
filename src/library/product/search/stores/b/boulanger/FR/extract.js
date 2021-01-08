
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
  });
  await new Promise((resolve) => setTimeout(resolve, 3000));
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
