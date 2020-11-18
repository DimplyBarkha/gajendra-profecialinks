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
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
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
  };
  await applyScroll(context);
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
