const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const detailsPageSelector = 'h1.pdp__main-title';

  const isSelectorAvailable = async (detailsPageSelector) => {
    console.log(`Is selector available: ${detailsPageSelector}`);
    return await context.evaluate(function (detailsPageSelector) {
      return !!document.querySelector(detailsPageSelector);
    }, detailsPageSelector);
  };

  const selectorAvailable = await isSelectorAvailable(detailsPageSelector);
  if (selectorAvailable) {
    console.log('Redirected to details page');
    throw new Error('ERROR: Loaded details page');
  } else {
    await context.waitForSelector('#product_listing_tab ul>li:last-child');
    context.evaluate(() => {
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
  }
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
