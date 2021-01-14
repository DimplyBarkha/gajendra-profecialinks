
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'blu',
    transform: null,
    domain: 'blu.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { productReviews } = dependencies;
    await context.evaluate(async () => {
      const popUps = document.querySelector('[data-testid="age-wall-button-accept"]');
      if (popUps) {
        popUps.click();
        await new Promise(resolve => { setTimeout(resolve, 5000); });
      }
      function addHiddenDivNoReview (id) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.setAttribute('noreviews', 'noreviews');
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function addHiddenDiv (id, reviewDate, rating, title, text) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.setAttribute('reviewDate', reviewDate);
        newDiv.setAttribute('rating', rating);
        newDiv.setAttribute('reviewTitle', title);
        newDiv.setAttribute('reviewText', text);
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (!document.querySelector('div#reviews')) {
        addHiddenDivNoReview('noreviews');
        await new Promise((resolve) => setTimeout(resolve, 10000));
      } else {
        let moreReviews = true;
        const reviewString = document.querySelector('div.sc-1tgc0g2-2.ipFJnx > span').textContent;
        const totalReviewsCount = Number(reviewString.match(/\d+/g)[0]);
        let foundReviews = 10;

        let page = 2;
        while (moreReviews && foundReviews < totalReviewsCount) {
          const url = window.location.href;
          const urlSplit = url.split('/');
          const itemStr = urlSplit[urlSplit.length - 1];
          const apiUrl = `https://www.blu.com/acceleration/eu/api/bazaarvoice-gateway/products/${itemStr}/reviews?page=${page}&pageSize=10&market=US&locale=en-US&sort=hightolow`;
          console.log(`PAGE#:${page}`);
          page++;

          const response = await fetch(apiUrl, {
            headers: {
              accept: '*/*',
              'accept-language': 'en-US,en;q=0.9',
              'sec-fetch-dest': 'script',
              'sec-fetch-mode': 'no-cors',
              'sec-fetch-site': 'cross-site',
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
            console.log('API called! Adding data..');
            if (data) {
              data.reviews.forEach((review) => {
                addHiddenDiv('my-reviews', review.timeAgoInWords, review.rating, review.title, review.message);
                foundReviews++;
              });
            }
          }
        }
      }
    });

    return await context.extract(productReviews);
  },
};
