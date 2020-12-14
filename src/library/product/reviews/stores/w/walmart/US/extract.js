const { transform } = require('../../../../shared');

async function preExtraction (context) {
  async function addReviewId () {
    const reviewIds = Object.values(__WML_REDUX_INITIAL_STATE__.product.reviews)[0].customerReviews.map(elm => elm.reviewId);
    Array.from(document.querySelectorAll('div[class="Grid-col customer-review-body"]')).forEach((e, i) => e.setAttribute('review-id', reviewIds[i]));
  }
  await context.evaluate(addReviewId);
}
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform,
    preExtraction,
    filterReviews: true,
    domain: 'walmart.com',
    zipcode: '',
  },
};
