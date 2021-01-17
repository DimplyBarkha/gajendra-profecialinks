const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;

  const cssCookiesDiv = '.container';
  const cssCookies = 'button#consent_prompt_submit';
  const cssReviews = 'a[data-test="reviews-flag-link"]';
  const cssReviewsRow = 'div[data-test="review-item"]';
  const cssShowMore = 'button[data-test="show-x-more-reviews-button"]';

  const isSelectorAvailable = async (cssSelector) => {
    return await context.evaluate(function (selector) {
      return !!document.querySelector(selector);
    }, cssSelector);
  };

  await context.waitForSelector(cssCookiesDiv, { timeout: 10000 });

  const coockiesAvailable = await isSelectorAvailable(cssCookies);
  if (coockiesAvailable) {
    await context.click(cssCookies);
  }

  const reviewsAvailable = await isSelectorAvailable(cssReviews);
  if (reviewsAvailable) {
    await context.click(cssReviews);
    await context.waitForSelector(cssReviewsRow, { timeout: 5000 });

    const showMoreAvailable = await isSelectorAvailable(cssShowMore);
    console.log(`showMoreAvailable: ${showMoreAvailable}`);
    if (showMoreAvailable) {
      await context.waitForNavigation({ timeout: 2000, waitUntil: 'load' });
      await context.evaluate(async function () {
        let moreReviews = true;
        while (moreReviews) {
          const reviewsButton = document.querySelector('button[data-test="show-x-more-reviews-button"]');
          if (reviewsButton) {
            reviewsButton.click();
            await new Promise((resolve, reject) => setTimeout(resolve, 4000));
          } else {
            moreReviews = false;
          }
        }
      });
    }
  }
  await context.evaluate(async () => {
    function addHiddenDivNoReview (id) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.setAttribute('noreviews', 'noreviews');
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    if (!document.querySelector('a[data-test="reviews-flag-link"]')) {
      addHiddenDivNoReview('noreviews');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  });

  return await context.extract(productReviews, { transform });
}
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'argos',
    transform,
    domain: 'argos.co.uk',
    zipcode: '',
  },
  implementation,
};
