async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  await context.evaluate(async function () {
    const ratings = document.querySelectorAll('.Review__overallStars__stars');
    if (ratings) {
      Array.from(ratings).forEach(rating => {
        const stars = rating.querySelectorAll('i.stars__icon');
        let ratingVal = 0;

        stars.forEach(star => {
          if (star.getAttribute('class').includes('icon-full-star-01')) ++ratingVal;
        });
        rating.setAttribute('custom_rating', String(ratingVal));
      });
    }
  });
  return await context.extract(productReviews);
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'reviews',
    transform: null,
    domain: 'reviews.co.uk',
    zipcode: '',
  },
  implementation,
};
