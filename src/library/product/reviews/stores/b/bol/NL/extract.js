/* eslint-disable no-shadow */
const { transform } = require('../shared');

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

    try {
      await context.waitForSelector('*[id="modalWindow"]', { timeout: 20000 });
      await context.click('button[data-test="modal-window-close"]');
    } catch (err) {
      console.log('Modal not present.');
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
      if (datesDiffInDays > 30) {
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

    await context.evaluate(async () => {
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

      /**
       * Function returning a string representation of a date object in the US date format.
       * @param {object} date review date object
       */
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (1 + date.getMonth()).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return month + '/' + day + '/' + year;
      };

      const brand = document.querySelector('a[data-analytics-tag="brand"]')
        ? document.querySelector('a[data-analytics-tag="brand"]').textContent
        : '';
      const name = document.querySelector('h1.page-heading > span')
        ? document.querySelector('h1.page-heading > span').textContent
        : '';
      const sku = document.evaluate(
        '(//div[@class="buy-block"]//a/@data-product-id | //div[@class="buy-block"]//div/@data-global-id)[1]',
        document,
        null,
        XPathResult.STRING_TYPE,
        null,
      ).stringValue;

      const ratingElem = document.querySelector('div[class="rating-horizontal__average-score"]');
      const rating = ratingElem ? ratingElem.textContent.replace('.', ',') : '';
      if (rating) document.body.setAttribute('rating', rating);

      document.body.setAttribute('added_brand', brand);
      document.body.setAttribute('added_name', name);
      document.body.setAttribute('added_sku', sku);
      document.body.setAttribute('product_url', window.location.href);

      const allReviews = document.querySelectorAll('ul[data-test="review-list"] > li');
      for (let i = 0; i < allReviews.length; i++) {
        const review = allReviews[i];

        const dateStr = review.querySelector('li[data-test="review-author-date"]')
          ? review.querySelector('li[data-test="review-author-date"]').textContent
          : '';
        const reviewDate = formatDate(getDate(dateStr));
        if (reviewDate) review.setAttribute('review_date', reviewDate);

        const ratingValue = review.querySelector('input[data-test="review-rating-value"]')
          ? review.querySelector('input[data-test="review-rating-value"]').getAttribute('value')
          : '';
        const rating = ratingValue ? parseInt(ratingValue, 10) / 20 : null;
        if (rating) review.setAttribute('added_rating', rating.toString());
      }
    });

    // return await context.extract(productReviews);
    return await context.extract(productReviews, { transform });
  },
};
