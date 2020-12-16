async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  await context.evaluate(async function () {
    const ratings = document.querySelectorAll('.stamped-review-header-starratings');
    if (ratings) {
      Array.from(ratings).forEach(rating => {
        const stars = rating.querySelectorAll('i.stamped-fa');
        let ratingVal = 0;

        [...stars].forEach(star => {
          if (star.getAttribute('class').includes('stamped-fa-star')) ++ratingVal;
        });
        rating.setAttribute('custom_rating', ratingVal);
      });
    }
  });

  return await context.extract(productReviews);
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'ziipstock',
    transform: null,
    domain: 'ziipstock.com',
    zipcode: "''",
  },
  implementation,

};
