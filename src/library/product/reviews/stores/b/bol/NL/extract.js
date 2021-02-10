const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productReviews }) => {
    const getDatesDiffInDays = (a, b) => {
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      // Discard the time and time-zone information.
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

      return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
    };

    /**
     * Function translating a given date to english.
     * @param {String} date date in Dutch
     */
    const translateDate = (date) => {
      const monthsDict = {
        januari: 'january',
        februari: 'february',
        maart: 'march',
        april: 'april',
        mei: 'may',
        juni: 'june',
        juli: 'july',
        augustus: 'august',
        september: 'september',
        oktober: 'october',
        november: 'november',
        december: 'december',
      };

      return date
        .split(' ')
        .map((item) => (Object.keys(monthsDict).includes(item.toLowerCase()) ? monthsDict[item] : item))
        .join(' ');
    };

    /**
     * Function parsing a given date string to a date object
     * @param {String} dateStr date as extracted on the page
     */
    const getDate = (dateStr) => {
      try {
        return new Date(translateDate(dateStr));
      } catch (err) {
        return null;
      }
    };

    try {
      console.log('Closing cookies popup.');
      await context.click('button[class="js-confirm-button"]');
    } catch (err) {
      console.log('Cookies popup not present.');
    }

    // Selecting the most recent reviews
    console.log('Filtering by date');
    await context.select('select#sort', 'MOST_RECENT');
    await new Promise((resolve) => setTimeout(resolve, 500));

    const shouldLoadMore = async (todayDate) => {
      const totalReviews = await context.evaluate(
        async () => document.querySelectorAll('ul[data-test="review-list"] > li').length,
      );
      if (totalReviews > 10000) return false;
      const lastReviewDateStr = await context.evaluate(async () => {
        const allReviews = document.querySelectorAll('ul[data-test="review-list"] > li');
        const lastReview = allReviews[allReviews.length - 1];
        const dateElem = lastReview.querySelector('li[data-test="review-author-date"]');
        return dateElem ? dateElem.textContent : '';
      });
      const lastReviewDate = getDate(lastReviewDateStr);
      if (!lastReviewDate) return true;
      const datesDiffInDays = getDatesDiffInDays(todayDate, lastReviewDate);
      console.log(`The difference between dates: ${datesDiffInDays} days`);
      if (datesDiffInDays > 360) {
        console.log('Not loading more reviews.');
        return false;
      }
      return true;
    };

    const today = new Date();
    while (await shouldLoadMore(today)) {
      console.log('Loading more reviews');
      try {
        console.log('Trying to load more reviews');
        await context.click('a[data-test="review-load-more"]');
        await context.waitForFunction(
          () => !document.querySelector('a[class="review-load-more__button js-review-load-more-button is-loading"]'),
          { timeout: 20000 },
        );
        console.log('Spinner went away');
      } catch (err) {
        console.log('No more results to load');
        break;
      }
    }
    console.log('Finished loading reviews');

    // await context.evaluate(async () => {

    // });

    // return await context.extract(productReviews, { transform });
    return await context.extract(productReviews);
  },
};
