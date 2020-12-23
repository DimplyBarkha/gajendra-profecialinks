const { transform } = require('./format');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'argos',
    transform,
    domain: 'argos.co.uk',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    try {
      console.log('Clicking on cookies button.');
      await context.waitForSelector('button[id*="consent_prompt_submit"]', { timeout: 10000 });
      await context.evaluate(function () {
        document.querySelector('button[id*="consent_prompt_submit"]').click();
      });
    } catch (err) {
      console.log('Clicking on cookies button failed.');
    }

    try {
      await context.waitForSelector('a[data-test*="reviews-flag-link"', { timeout: 10000 });
      await context.evaluate(function () {
        document.querySelector('a[data-test*="reviews-flag-link"').click();
      });
      await context.waitForSelector('div[id*="reviews"]');
    } catch (err) {
      console.log(err);
    }

    const checkIfReviewIsFromLast30Days = (lastDate, reviewDate) => {
      const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
      return (new Date(reviewDate).getTime() > timestamp);
    };

    const totalReviews = await context.evaluate(() => {
      let totalReviews = 0;
      const totalReviewsElement = document.querySelector('div[class*="cFzgQO"] div:nth-child(1) p');
      if (totalReviewsElement) {
        const totalReviewsStr = totalReviewsElement.textContent.split(' ')[0];
        totalReviews = parseInt(totalReviewsStr, 10);
      }
      return totalReviews;
    });

    const latestReviewDate = await context.evaluate(() => {
      let reviewDate = '';
      const reviewElements = document.querySelectorAll('div[data-test="review-item"]');
      if (reviewElements && reviewElements.length > 0) {
        const reviewDateElement = reviewElements[0].querySelector('time[class*="jbcxwt"][datetime]');
        if (reviewDateElement) {
          const pattern = /([0-9]+-[0-9]+-[0-9]+)/i;
          const results = reviewDateElement.dateTime.match(pattern);
          if (results && results.length > 0) {
            reviewDate = results[1];
          }
        }
      }
      // reviewDate = reviewDate.split('-').reverse().join('/');
      return reviewDate;
    });

    const getLastReviewDate = () => {
      return context.evaluate(() => {
        let reviewDate = '';
        const reviewElements = document.querySelectorAll('div[data-test="review-item"]');
        if (reviewElements && reviewElements.length > 0) {
          const reviewDateElement = reviewElements[reviewElements.length - 1].querySelector('time[class*="jbcxwt"][datetime]');
          if (reviewDateElement) {
            const pattern = /([0-9]+-[0-9]+-[0-9]+)/i;
            const results = reviewDateElement.dateTime.match(pattern);
            if (results && results.length > 0) {
              reviewDate = results[1];
            }
          }
        }
        // reviewDate = reviewDate.split('-').reverse().join('/');
        return reviewDate;
      });
    };

    const getAllReviewsCount = async () => {
      return context.evaluate(() => {
        const allReviews = document.querySelectorAll('div[data-test="review-item"]');
        return allReviews.length;
      });
    };

    let allReviewsCount = await getAllReviewsCount();
    let lastReviewDate = await getLastReviewDate();
    while (checkIfReviewIsFromLast30Days(latestReviewDate, lastReviewDate) && allReviewsCount < totalReviews) {
      await context.click('button[data-test*="show-x-more-reviews-button"]');
      await new Promise(resolve => setTimeout(resolve, 1000));
      allReviewsCount = await getAllReviewsCount();
      lastReviewDate = await getLastReviewDate();
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

    const { transform } = parameters;
    const { productReviews } = dependencies;
    return await context.extract(productReviews, { transform });
  },
};
