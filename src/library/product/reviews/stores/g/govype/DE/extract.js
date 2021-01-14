async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  await context.evaluate(async () => {
    function addHiddenDiv (id, reviewObj) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.setAttribute('authorName', reviewObj.authorName);
      newDiv.setAttribute('datePublished', reviewObj.datePublished);
      newDiv.setAttribute('reviewBody', reviewObj.reviewBody);
      newDiv.setAttribute('aggregateRating', reviewObj.aggregateRating);
      newDiv.setAttribute('ratingValue', reviewObj.ratingValue);
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    try {
      if (document.querySelector('button#onetrust-accept-btn-handler')) {
        document.querySelector('button#onetrust-accept-btn-handler').click();
      }
      if (document.querySelector('button#btn-entry-age-allow')) {
        document.querySelector('button#btn-entry-age-allow').click();
      }

      if (document.querySelectorAll('ul.ts-reviews-pagination li')) {
        const script = document.querySelector('script[type="application/ld+json"]');
        const scriptContent = JSON.parse(script.textContent);
        const aggregateRating = scriptContent.aggregateRating.ratingValue;
        const pageSelector = document.querySelectorAll('ul.ts-reviews-pagination li');
        const totalPages = document.querySelectorAll('ul.ts-reviews-pagination li').length;
        let currPage = 1;
        for (let i = 0; i < totalPages; i++) {
          const reviewBlock = document.querySelectorAll('ul.ts-reviews-list li');
          if (reviewBlock.length > 0) {
            for (let j = 0; j < reviewBlock.length; j++) {
              const authorName = (reviewBlock[j].querySelector('.ts-buyer-info')) ? reviewBlock[j].querySelector('.ts-buyer-info').innerText : '';
              const datePublished = (reviewBlock[j].querySelector('.ts-published-date')) ? reviewBlock[j].querySelector('.ts-published-date').innerText : '';
              const reviewBody = (reviewBlock[j].querySelector('.ts-review-text')) ? reviewBlock[j].querySelector('.ts-review-text').innerText : '';
              const rating = (reviewBlock[j].querySelector('.ts-stars-fullBar'));
              const ratingValue = parseInt(rating.style.width) / 25;
              const reviewObj = {
                authorName: authorName,
                datePublished: datePublished,
                reviewBody: reviewBody,
                aggregateRating: aggregateRating,
                ratingValue: ratingValue,
              };
              addHiddenDiv('my-reviews', reviewObj);
            }
          }
          if (currPage < totalPages) {
            pageSelector[currPage].querySelector('a').click();
            currPage++;
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }
      }
    } catch (e) {
      console.log('button not found');
    }
  });
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'govype',
    transform: null,
    domain: 'govype.com',
    zipcode: "''",
  },
  implementation,
};
