const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    transform,
    domain: 'asda.com',
    zipcode: "''",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productReviews } = dependencies;
    // eslint-disable-next-line no-shadow
    const { transform } = parameters;

    async function extractionHelper () {
      await context.evaluate(() => {
        function corectFormat (dateSelector) {
          const dayMonthYear = dateSelector.textContent.split('/');
          return String(dayMonthYear[2]) + '-' + String(dayMonthYear[1]) + '-' + String(dayMonthYear[0]);
        };

        let review;
        const reviews = document.querySelectorAll('div[data-auto-id="reviewContents"] div[class="rating-stars__stars rating-stars__stars--top"]');
        const dateSelector = document.querySelectorAll('div[class="pdp-description-reviews__submitted-date"]');
        for (let i = 0; i < reviews.length; i++) {
          review = reviews[i].style.width.replace('%', '');
          document.querySelectorAll(
            'div[data-auto-id="reviewContents"] div[class="rating-stars__stars rating-stars__stars--top"]')[i]
            .setAttribute('review', String((parseFloat(review) / 20)));

          document.querySelectorAll('div[class="pdp-description-reviews__submitted-date"]')[i].setAttribute('date', corectFormat(dateSelector[i]));
        }

        const url = document.location.href;
        document.querySelector('section[id="main-content"]').setAttribute('sku', url.match('([^\/]+$)')[1]);
      });
    }

    async function nextPage () {
      await context.evaluate(() => {
        document.querySelector('button[data-auto-id="btnright"]').click();
      });
      ;
    }

    // pagination

    let pageNumber = 1;

    while (true) {
      await context.waitForSelector('div[class="pdp-description-reviews__reviews-contents-cntr"], div[class="pdp-description-reviews__no-reviews"]');
      const lastPage = await context.evaluate(() => {
        return parseInt(document.querySelector(
          'button[class="asda-link asda-link--primary asda-link--button co-pagination__last-page"]').textContent);
      });

      const monthAgoReviewExist = await context.evaluate(() => {
        function checkIfReviewIsFromLast30Days (reviewDate) {
          const monthAgo = new Date(Date.now());
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return reviewDate <= monthAgo;
        }

        const dateArray = document.querySelector('div[class="pdp-description-reviews__submitted-date"]').textContent.split('/');
        const reviewDate = new Date(parseInt(dateArray[2]), parseInt(dateArray[1]) - 1, parseInt(dateArray[0]));

        return checkIfReviewIsFromLast30Days(reviewDate);
      });

      extractionHelper();

      if (monthAgoReviewExist || (lastPage === pageNumber || pageNumber >= 15)) {
        return await context.extract(productReviews, { transform }, 'MERGE_ROWS');
      } else {
        await context.extract(productReviews, { transform }, 'MERGE_ROWS');

        await new Promise((resolve) => setTimeout(resolve, 1500));

        pageNumber++;
        nextPage();
      }
    }
  },
};
