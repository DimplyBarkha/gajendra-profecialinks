const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  context.evaluate(() => {
    document.querySelector('.breadcrumb>li').remove();
    const reviewStars = document.querySelectorAll('.reviews-stars-link__stars');
    let i;
    for (i = 0; i < reviewStars.length; ++i) {
      const htmlText = reviewStars[i].innerHTML;
      const arr = htmlText.match(/star-o/g);
      const arr2 = htmlText.match(/half-o/g);
      let rating = 5;
      if (arr) {
        rating = rating - arr.length;
      }
      if (arr2) {
        rating = rating - 0.5;
      }
      reviewStars[i].innerHTML = '<div class="rating">' + rating + '</div>';
    }
  });
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'thegoodguys',
    transform,
    domain: 'thegoodguys.com.au',
    zipcode: '',
  },
  implementation,
};
