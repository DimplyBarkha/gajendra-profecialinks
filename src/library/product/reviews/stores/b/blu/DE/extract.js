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
    if (document.querySelector('button.sc-1ukymkt-2')) {
      document.querySelector('button.sc-1ukymkt-2').click();
    }
  });
  await context.evaluate(async () => {
    let moreReviews = true;
    const reviewString = document.querySelector('div.sc-1tgc0g2-2.ipFJnx > span').textContent;
    const totalReviewsCount = Number(reviewString.match(/\d+/g)[0]);
    let foundReviews = 10;
    let page = 2;
    while (moreReviews && foundReviews < totalReviewsCount) {
      const url = window.location.href;
      const urlSplit = url.split('/');
      const itemStr = urlSplit[urlSplit.length - 1];
      const itemStr1 = itemStr.replace(/[0-9]+[a-z,A_Z]+-/g,'');
      const apiUrl = `https://www.blu.com/acceleration/eu/api/bazaarvoice-gateway/products/${itemStr1}/reviews?page=${page}&pageSize=10&market=DE&locale=de-DE&sort=hightolow`;
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
        const data = await response.json();
        console.log('API called! Adding data..');
        // foundReviews++;
        if(data){
          data.reviews.forEach((review) => {
            addHiddenDiv('my-reviews', review.timeAgoInWords, review.rating, review.title, review.message);
            foundReviews++;
          });
        }
      }
    }
  });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'blu',
    transform,
    domain: 'blu.com',
    zipcode: '',
  },
  implementation,
};
