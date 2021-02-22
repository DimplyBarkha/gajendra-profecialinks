const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'bloomingdales',
    transform: transform,
    domain: 'bloomingdales.com',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productReviews }) => {
    await context.evaluate(async () => {

      for (let i = 0; i <= document.body.scrollHeight; i = i + 500) {
        window.scrollBy({ top: i, left: 0, behavior: 'smooth' });
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }


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
        const totalReviews = document.querySelectorAll('div.bv-content-item-avatar-offset').length;
        if (totalReviews > 10000) return false;

        const allReviews = document.querySelectorAll('div.bv-content-item-avatar-offset');
        if (!allReviews) {
          return false;
        }
        const firstReview = allReviews[0];
        const dateElemFirst = firstReview.querySelector('meta[itemprop="datePublished"]');

        let firstReviewDateStr = '';
        if (dateElemFirst) {
          firstReviewDateStr = dateElemFirst.getAttribute('content');
        }
        const firstReviewDate = getDate(firstReviewDateStr);
        const firstdatesDiffInDays = getDatesDiffInDays(todayDate, firstReviewDate);
        console.log(`The difference between dates: ${firstdatesDiffInDays} days`);
        return (firstdatesDiffInDays < 30);
      };

      // const gtin = document.evaluate('//div[@class="formLabel SB_m EffortItemCode"]//div[@class="formLabel"][contains(@content, "gtin")]/text()', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const brand = document.evaluate('//a[@data-auto="product-brand"]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const name = document.evaluate('//div[@data-auto="product-name"]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      // const sku = document.evaluate('//div[@class="formLabel SB_m EffortItemCode"]//div[@class="formLabel"][contains(@content, "mpn")]/text()', document, null, XPathResult.STRING_TYPE, null).stringValue;
      // const ratingElem = document.evaluate('//div[contains(@class, "skuReviews")]//span[@id="productRating"]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      // const rating = ratingElem ? ratingElem.replace('.', ',') : '';
      // if (rating) document.body.setAttribute('rating', rating);

      document.body.setAttribute('added_brand', brand);
      // document.body.setAttribute('added_gtin', gtin);
      document.body.setAttribute('added_name', name);
      // document.body.setAttribute('added_sku', sku);
      document.body.setAttribute('product_url', window.location.href);

      function appendElementToParent(node, parentSelector) {
        const parentNode = document.querySelector(parentSelector);
        parentNode.appendChild(node);
      }

      const reviews = document.createElement('div');
      reviews.id = 'added_reviews';
      appendElementToParent(reviews, 'body');

      const today = new Date();
      while (document.querySelector('div.bv-content-item-avatar-offset') && await shouldLoadMore(today)) {
        const allReviews = document.querySelectorAll('div.bv-content-item-avatar-offset');
        console.log('odpalam dla:', allReviews);
        for (let i = 0; i < allReviews.length; i++) {
          const catReview = document.createElement('div');
          catReview.id = 'review';

          const review = allReviews[i];
          review.setAttribute('class', 'visited');

          const dateStr = review.querySelector('meta[itemprop="datePublished"]');
          if (dateStr) {
            const reviewDate = formatDate(getDate(dateStr.getAttribute('content')));
            catReview.setAttribute('review_date', reviewDate);
          }

          const ratingValue = review.querySelector('meta[itemprop="ratingValue"]');
          if (ratingValue) catReview.setAttribute('added_rating', ratingValue.getAttribute('content'));

          const reviewText = review.querySelector('div[itemprop="reviewBody"] p');
          if (reviewText) catReview.setAttribute('added_text', reviewText.textContent);

          const reviewTitle = review.querySelector('h3[itemprop="headline"]');
          if (reviewTitle) catReview.setAttribute('added_title', reviewTitle.textContent);

          const user = review.querySelector('span.bv-author span');
          if (user) catReview.setAttribute('added_user', user.textContent);

          const helpfulCount = review.querySelector('button.bv-content-btn-feedback-yes>span>span');
          if (helpfulCount) catReview.setAttribute('added_helpful', helpfulCount.textContent);

          appendElementToParent(catReview, 'div#added_reviews');
        }
        try {
          document.querySelector('a.bv-content-btn').click();
        } catch (e) {
          console.log('there is no next button to click');
        }
        await new Promise((resolve, reject) => setTimeout(resolve, 1500));
      }
    });

    return await context.extract(productReviews, { transform });
  },
};