
const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  await context.evaluate(async () => {
    const ratings = document.querySelectorAll('.b_rating--size-small');
    if (ratings) {
      Array.from(ratings).forEach(rating => {
        const stars = rating.querySelectorAll('span.b_rating__star');
        let ratingVal = 0;

        [...stars].forEach(star => {
          if (star.getAttribute('class').includes('b_rating__star--active')) ++ratingVal;
        });
        rating.setAttribute('custom_rating', ratingVal);
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  });

  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'RU',
    store: 'vardex',
    transform,
    domain: 'vardex.ru',
    zipcode: '',
  },
  implementation,
};
