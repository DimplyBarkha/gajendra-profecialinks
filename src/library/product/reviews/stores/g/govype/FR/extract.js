
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  await context.evaluate(async () => {
    while (document.querySelector('.page-bottom #netreviews_button_more_reviews:not([style*="display:none"]):not([style*="display: none"])')) {
      document.querySelector('#netreviews_button_more_reviews').click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const ratings = document.querySelectorAll('.netreviews_review_rate_and_stars');
    if (ratings) {
      Array.from(ratings).forEach(rating => {
        console.log('rating: ', rating);
        const stars = rating.querySelectorAll('div:nth-child(2)>span');
        let ratingVal = 0;
        [...stars].forEach(star => {
          if (star.getAttribute('class').includes('nr-icon nr-star gold')) ++ratingVal;
        });
        var result = document.evaluate('//div[@class="netreviews_review_rate_and_stars"]//@custom_rating', document, null, XPathResult.ANY_TYPE, null);
        console.log('ratingVal: ', result);
        rating.setAttribute('custom_rating', String(ratingVal));
      });
    }
  });
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'FR',
    store: 'govype',
    transform: null,
    domain: 'govype.com',
    zipcode: "''",
  },
  implementation,
};
