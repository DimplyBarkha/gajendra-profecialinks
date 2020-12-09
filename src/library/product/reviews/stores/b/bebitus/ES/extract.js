const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    transform,
    domain: 'bebitus.com',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.evaluate(async function () {
    function timeout (ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const loadMore = document.evaluate('//div[@class="ratings-bazaarvoice-overlay"][contains(@style,"display: none;")]', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    if (!loadMore) {
      const reviewButton = document.querySelector('div.ratings-list-preselected div.ratings-list-button');
      if (reviewButton) {
        // @ts-ignore
        reviewButton.click();
        reviewButton.remove();
        await timeout(5000);
        const removeElement = document.querySelector('div.ratings-list.ratings-list-preselected');
        removeElement.remove();
        const lastReviewDate = document.querySelector('ol.bv-content-list.bv-content-list-reviews li.bv-content-item.bv-content-top-review.bv-content-review:nth-child(1) div.bv-content-datetime meta:first-child') &&
        document.querySelector('ol.bv-content-list.bv-content-list-reviews li.bv-content-item.bv-content-top-review.bv-content-review:nth-child(1) div.bv-content-datetime meta:first-child').getAttribute('content');
        const review = document.createElement('a');
        review.setAttribute('class', 'last-review-date');
        review.textContent = lastReviewDate;
        document.body.appendChild(review);
      }
    } else {
      console.log('Popup already open');
    }
  });

  const { transform } = parameters;
  const { productReviews } = dependencies;
  return await context.extract(productReviews, { transform });
}
