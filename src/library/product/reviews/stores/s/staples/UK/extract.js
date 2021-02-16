/* eslint-disable no-shadow */
const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    transform,
    domain: 'staples.co.uk',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productReviews }) => {
    try {
      console.log('Closing cookies popup.');
      await context.click('button[class="accept-all-cookies"]');
    } catch (err) {
      console.log('Cookies popup not present.');
    }
    try {
      await context.waitForSelector('div[id="VATSelectionTakeOver"]', { timeout: 20000 });
      await context.click('input[class="button js-vatOption VATbtn"]');
    } catch (err) {
      console.log('Modal not present.');
    }
    await context.evaluate(async () => {
      /**
       * Function translating a given date to English.
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
     * Function checking whether we should load more reviews. It returns false if
     * there are more than 10000 reviews loaded, or the first loaded review is
     * older than 30 days.
     * @param {object} todayDate today datetime object
     */
      const shouldLoadMore = async (todayDate) => {
        const totalReviews = document.querySelectorAll('div#added_reviews > div#review').length;
        if (totalReviews > 10000) return false;

        const allReviews = document.querySelectorAll('section[data-testid="review-list"] > div.pr-review');
        if (!allReviews) {
          return false;
        }
        const firstReview = allReviews[0];
        const dateElemFirst = firstReview.querySelector('p.pr-rd-details.pr-rd-author-submission-date time');

        let firstReviewDateStr = '';
        if (dateElemFirst) {
          firstReviewDateStr = dateElemFirst.getAttribute('datetime');
        }
        const firstReviewDate = getDate(firstReviewDateStr);
        const firstdatesDiffInDays = getDatesDiffInDays(todayDate, firstReviewDate);
        console.log(`The difference between dates: ${firstdatesDiffInDays} days`);
        return (firstdatesDiffInDays < 30);
      };

      const gtin = document.evaluate('//div[@class="formLabel SB_m EffortItemCode"]//div[@class="formLabel"][contains(@content, "gtin")]/text()', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const brand = document.evaluate('//div[@class="formLabel SB_m EffortItemCode"]//div[@class="formLabel SL_m"]/text()', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const name = document.evaluate('//h1[@class="skuName"]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const sku = document.evaluate('//div[@class="formLabel SB_m EffortItemCode"]//div[@class="formLabel"][contains(@content, "mpn")]/text()', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const ratingElem = document.evaluate('//div[contains(@class, "skuReviews")]//span[@id="productRating"]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const rating = ratingElem ? ratingElem.replace('.', ',') : '';
      if (rating) document.body.setAttribute('rating', rating);

      document.body.setAttribute('added_brand', brand);
      document.body.setAttribute('added_gtin', gtin);
      document.body.setAttribute('added_name', name);
      document.body.setAttribute('added_sku', sku);
      document.body.setAttribute('product_url', window.location.href);

      function appendElementToParent (node, parentSelector) {
        const parentNode = document.querySelector(parentSelector);
        parentNode.appendChild(node);
      }

      const reviews = document.createElement('div');
      reviews.id = 'added_reviews';
      appendElementToParent(reviews, 'body');

      const today = new Date();
      while (document.querySelector('div#skuTabReviews a[aria-label="Next"]') && await shouldLoadMore(today)) {
        const allReviews = document.querySelectorAll('div.pr-review');
        for (let i = 0; i < allReviews.length; i++) {
          const catReview = document.createElement('div');
          catReview.id = 'review';

          const review = allReviews[i];
          review.setAttribute('class', 'visited');

          const dateStr = review.querySelector('p.pr-rd-details.pr-rd-author-submission-date time');
          if (dateStr) {
            const reviewDate = formatDate(getDate(dateStr.getAttribute('datetime')));
            catReview.setAttribute('review_date', reviewDate);
          }

          const ratingValue = review.querySelector('div.pr-snippet-rating-decimal');
          if (ratingValue) catReview.setAttribute('added_rating', ratingValue.textContent);

          const reviewText = review.querySelector('p.pr-rd-description-text');
          if (reviewText) catReview.setAttribute('added_text', reviewText.textContent);

          const reviewTitle = review.querySelector('span.pr-rd-review-headline.pr-h2');
          if (reviewTitle) catReview.setAttribute('added_title', reviewTitle.textContent);

          const verifiedBuyer = review.querySelector('span.pr-rd-badging-text');
          if (verifiedBuyer && verifiedBuyer.textContent.includes('Verified Buyer')) catReview.setAttribute('added_verified', 'Yes');

          const syndicatedFrom = review.querySelector('p.pr-rd-details.pr-rd-author-location span span:not([class])');
          if (syndicatedFrom) catReview.setAttribute('added_from', syndicatedFrom.textContent);

          const user = review.querySelector('p.pr-rd-details.pr-rd-author-nickname span span:not([class])');
          if (user) catReview.setAttribute('added_user', user.textContent);

          const helpfulCount = review.querySelector('button.pr-helpful-btn.pr-helpful-yes span.pr-helpful-count');
          if (helpfulCount) catReview.setAttribute('added_helpful', helpfulCount.textContent);

          appendElementToParent(catReview, 'div#added_reviews');
        }
        document.querySelector('div#skuTabReviews a[aria-label="Next"]').click();
        await new Promise((resolve, reject) => setTimeout(resolve, 1500));
      }
    });

    return await context.extract(productReviews, { transform });
  },
};
