async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
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
  });

  return await context.extract(productReviews);
}
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'CA',
    store: '180smoke',
    transform: null,
    domain: '180smoke.ca',
    zipcode: '',
  },
  implementation,
};
