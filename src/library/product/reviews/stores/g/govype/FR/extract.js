const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  await context.evaluate(async () => {
    if (!document.querySelector('div.netreviews-stars')) {
      const newDiv = document.createElement('div');
      newDiv.id = 'custom_noReview';
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    // if (document.querySelector('#netreviews_button_more_reviews')) {
    //   const reviewString = document.querySelector('p.netreviews_subtitle').textContent;
    //   const totalReviewsCount = Number(reviewString.match(/\d+/g)[0]);

    //   console.log('totalReviewsCount ', totalReviewsCount);

    //   let reviewBlock = document.querySelectorAll('div.netreviews_review_part').length;
    //   let buttonClick = true;
    //   // while (document.querySelector('.page-bottom #netreviews_button_more_reviews:not([style*="display:none"]):not([style*="display: none"])')) {
    //   while (buttonClick) {
    //     document.querySelector('#netreviews_button_more_reviews').click();
    //     await new Promise((resolve) => setTimeout(resolve, 2000));
    //     reviewBlock = document.querySelectorAll('div.netreviews_review_part').length;
    //     console.log('current count ', reviewBlock);
    //     if (totalReviewsCount <= reviewBlock) {
    //       buttonClick = false;
    //     }
    //   }
    // }
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
  return await context.extract(productReviews, { transform, type: 'MERGE_ROWS' });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'FR',
    store: 'govype',
    transform,
    domain: 'govype.com',
    zipcode: "''",
  },
  implementation,
};
