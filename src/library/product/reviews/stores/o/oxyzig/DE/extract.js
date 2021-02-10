async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  await context.evaluate(async function () {
    const ratings = document.querySelectorAll('span.stars.flat');
    if (ratings) {
      Array.from(ratings).forEach(rating => {
        const stars = rating.querySelectorAll('i.fa.fa-star');
        let ratingVal = 0;

        [...stars].forEach(star => {
          if (star.getAttribute('class').includes('fa-star')) ++ratingVal;
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
    country: 'DE',
    store: 'oxyzig',
    transform: null,
    domain: 'oxyzig.de',
    zipcode: '',
  },
  implementation,
};
