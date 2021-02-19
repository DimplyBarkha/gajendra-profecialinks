const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    transform,
    domain: 'superdrug.com',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    { transform },
    context,
    { productReviews },
  ) {
    /**
     * A function returning the absolute number of days between 2 dates
     * @param {object} a first datetime object
     * @param {object} b second datetime object
     */
    const getDatesDiffInDays = (a, b) => {
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      // Discard the time and time-zone information.
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

      return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
    };

    /**
     * Function parsing a given date string to a date object
     * @param {String} dateStr date as extracted on the page
     */
    const getDate = (dateStr) => {
      try {
        return new Date(dateStr);
      } catch (err) {
        return null;
      }
    };
    // Selecting the most recent reviews
    await context.waitForSelector('select[class="bv-select-cleanslate bv-dropdown-select"]');
    console.log('Filtering by date');
    await context.select('select[class="bv-select-cleanslate bv-dropdown-select"]', 'mostRecent');
    await new Promise((resolve) => setTimeout(resolve, 500));

    /**
     * Function checking whether we should load more reviews. It returns false if
     * there are more than 10000 reviews loaded, or the last loaded review is
     * older than 30 days.
     * @param {object} todayDate today datetime object
     */
    const shouldLoadMore = async (todayDate) => {
      const totalReviews = await context.evaluate(
        async () => document.querySelectorAll('ol > li[itemprop="review"]').length,
      );
      if (totalReviews > 10000) return false;
      const lastReviewDateStr = await context.evaluate(async () => {
        const allReviews = document.querySelectorAll('ol > li[itemprop="review"]');
        const lastReview = allReviews[allReviews.length - 1];
        const dateElem = lastReview.querySelector('meta[itemprop="dateCreated"]');
        return dateElem ? dateElem.getAttribute('content') : '';
      });

      const lastReviewDate = getDate(lastReviewDateStr);
      if (!lastReviewDate) return true;

      const datesDiffInDays = getDatesDiffInDays(todayDate, lastReviewDate);
      console.log(`The difference between dates: ${datesDiffInDays} days`);
      return !(datesDiffInDays > 30);
    };

    const today = new Date();
    while (await shouldLoadMore(today)) {
      console.log('Loading more reviews');
      try {
        console.log('Trying to load more reviews');
        await context.click('button[class="bv-content-btn bv-content-btn-pages bv-content-btn-pages-load-more bv-focusable"]');
        console.log('Spinner went away');
      } catch (err) {
        console.log('No more results to load');
        break;
      }
    }
    console.log('Finished loading reviews');

    await context.evaluate(async () => {
      /**
       * Function parsing a given date string to a date object
       * @param {String} dateStr date as extracted on the page
       */
      const getDate = (dateStr) => {
        try {
          return new Date(dateStr);
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
      const name = document.querySelector('h1[class="pdp__productName"]')
        ? document.querySelector('h1[class="pdp__productName"]').textContent
        : '';
      const sku = document.querySelector('p[itemprop="sku"]')
        ? document.querySelector('p[itemprop="sku"]').textContent
        : '';
      const brand = document.querySelector('span[class="pdp__byBrand"] a')
        ? document.querySelector('span[class="pdp__byBrand"] a').textContent
        : '';
      const aggregateRating = document.querySelector('a[class="bv-rating-stars-container bv-focusable"] span[class="bv-off-screen"]')
        ? document.querySelector('a[class="bv-rating-stars-container bv-focusable"] span[class="bv-off-screen"]').textContent
        : '';
      document.body.setAttribute('added_name', name);
      document.body.setAttribute('added_sku', sku);
      document.body.setAttribute('brand', brand);
      document.body.setAttribute('aggregate_rating', aggregateRating);
      document.body.setAttribute('product_url', window.location.href);

      const allReviews = document.querySelectorAll('ol > li[itemprop="review"]');
      for (let i = 0; i < allReviews.length; i++) {
        const review = allReviews[i];

        const dateStr = review.querySelector('meta[itemprop="dateCreated"]')
          ? review.querySelector('meta[itemprop="dateCreated"]').getAttribute('content')
          : '';
          console.log('!!!!!!');
          console.log(dateStr);
          console.log(getDate(dateStr));
        const reviewDate = formatDate(getDate(dateStr));
        if (reviewDate) review.setAttribute('review_date', reviewDate);
        const reviewRating = review.querySelector('div[class="bv-content-header-meta"] meta[itemprop="ratingValue"]')
          ? review.querySelector('div[class="bv-content-header-meta"] meta[itemprop="ratingValue"]').getAttribute('content')
          : '';
        if (reviewRating) review.setAttribute('review_rating', reviewRating);
        const syndicatedFrom = review.querySelector('div[class="bv-syndication-summary"] img')
          ? review.querySelector('div[class="bv-syndication-summary"] img').getAttribute('alt')
          : '';
        if (syndicatedFrom) review.setAttribute('synficated', syndicatedFrom);
        const reviewText = review.querySelector('div[class="bv-content-summary-body-text"] p')
          ? review.querySelector('div[class="bv-content-summary-body-text"] p').textContent
          : '';
        if (reviewText) review.setAttribute('added_text', reviewText);
        const user = review.querySelector('span[class="bv-author"] span')
          ? review.querySelector('span[class="bv-author"] span').textContent
          : '';
        if (user) review.setAttribute('user', user);
        const comment = review.querySelector('button[class="bv-content-btn bv-content-btn-feedback-yes bv-focusable"] span[class="bv-content-btn-count"]')
          ? review.querySelector('button[class="bv-content-btn bv-content-btn-feedback-yes bv-focusable"] span[class="bv-content-btn-count"]').textContent
          : '';
        if (comment) review.setAttribute('comment', comment);
        if (sku) review.setAttribute('added_reviewedSku', sku);
      }
    });
    return await context.extract(productReviews, { transform });
  },
};
