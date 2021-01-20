const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  await context.evaluate(async function () {
    function addEleToDoc (key, value) {
      const prodEle = document.createElement('div');
      prodEle.id = key;
      prodEle.textContent = value;
      prodEle.style.display = 'none';
      document.body.appendChild(prodEle);
    }
    const script = document.querySelector('script[type="application/ld+json"]');
    const scriptContent = JSON.parse(script.textContent);
    var aggreegateRating = scriptContent[0].aggregateRating.ratingValue;
    addEleToDoc('main_custom_rating', aggreegateRating);

    const ratings = document.querySelectorAll('div.card-title > div.reviews-container > ul.reviews-stars');
    if (ratings) {
      Array.from(ratings).forEach(rating => {
        const stars = rating.querySelectorAll('li.list-inline-item > svg > path');
        let ratingVal = 0;
        [...stars].forEach(star => {
          if (star.getAttribute('d').includes('M3.1')) ++ratingVal;
        });
        rating.setAttribute('custom_rating', ratingVal);
      });
    }

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.setAttribute('detail', content.detail);
      newDiv.setAttribute('nickname', content.nickname);
      newDiv.setAttribute('title', content.title);
      newDiv.setAttribute('review_at', content.review_at);
      newDiv.setAttribute('ratings', content.ratings[0].value);
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    let moreReviews = true;
    const reviewString = document.querySelector('div.reviews-text').textContent;
    const totalReviewsCount = Number(reviewString.match(/\d+/g)[0]);
    let foundReviews = 10;

    let page = 2;
    while (moreReviews && foundReviews < totalReviewsCount) {
      const url = window.location.href;
      const itemStr = JSON.parse(document.querySelector('script#__NEXT_DATA__').textContent).props.pageProps.content.id;
      const apiUrl = `https://www.180smoke.ca/api/graphql?query=query getReviews($productId:Int!$page:Int){reviews(filter:{product_id:$productId}currentPage:$page){summary{rating count __typename}items{customer_id detail nickname title review_at ratings{vote_id review_id rating_code value __typename}__typename}__typename}}&operationName=getReviews&variables={"productId":${itemStr},"page":${page}}`;
      page++;
      const response = await fetch(apiUrl, {
        headers: {
          accept: '*/*',
        },
        referrer: url,
        referrerPolicy: 'no-referrer-when-downgrade',
        body: null,
        method: 'GET',
        mode: 'cors',
      });
      if (!response || response.status !== 200 || foundReviews === totalReviewsCount) {
        moreReviews = false;
      } else {
        const data = await response.json();
        if (data) {
          data.data.reviews.items.forEach((review) => {
            addHiddenDiv('my-reviews', review);
            foundReviews++;
          });
        }
      }
    }
  });

  return await context.extract(productReviews, { transform });
}
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'CA',
    store: '180smoke',
    transform,
    domain: '180smoke.ca',
    zipcode: '',
  },
  implementation,
};
