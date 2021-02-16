const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    transform: transform,
    domain: 'groceries.morrisons.com',
    zipcode: '',
  }, implementation: async (inputs, { transform }, context, { productReviews }) => {

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
        const totalReviews = document.querySelectorAll('div.gn-card.bop-reviews__review').length;
        if (totalReviews > 10000) return false;

        const allReviews = document.querySelectorAll('div.gn-card.bop-reviews__review');
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
      const brand = document.evaluate("//ul[@class='bop-tagsList']/li[last()]/div[@class='bop-tagsWrapper']/a[@class='bop-tag']", document, null, XPathResult.STRING_TYPE, null).stringValue;
      const name = document.evaluate('//header[@class="bop-title"]/h2/text()', document, null, XPathResult.STRING_TYPE, null).stringValue;
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
      while (document.querySelector('div.gn-card.bop-reviews__review') && await shouldLoadMore(today)) {
        const allReviews = document.querySelectorAll('div.gn-card.bop-reviews__review');
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

          const reviewText = review.querySelector('p');
          if (reviewText) catReview.setAttribute('added_text', reviewText.textContent);

          const reviewTitle = review.querySelector('h6.bop-reviews__title');
          if (reviewTitle) catReview.setAttribute('added_title', reviewTitle.textContent);

          const user = review.querySelector('a[itemprop="author"]');
          if (user) catReview.setAttribute('added_user', user.textContent);

          const helpfulCount = review.querySelector('span.bop-reviews__recommendationWrapper>button+span');
          if (helpfulCount) catReview.setAttribute('added_helpful', helpfulCount.textContent);

          appendElementToParent(catReview, 'div#added_reviews');

        }
      }
    });

    return await context.extract(productReviews, { transform });
  },
};


//     //   /**
//     //    * A function returning the absolute number of days between 2 dates
//     //    * @param {object} a first datetime object
//     //    * @param {object} b second datetime object
//     //    */
//     const getDatesDiffInDays = (a, b) => {
//       const _MS_PER_DAY = 1000 * 60 * 60 * 24;
//       // Discard the time and time-zone information.
//       const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
//       const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

//       return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
//     };

//     //   /**
//     //    * Function parsing a given date string to a date object
//     //    * @param {String} dateStr date as extracted on the page
//     //    */
//     const getDate = (dateStr) => {
//       try {
//         return new Date(dateStr);
//       } catch (err) {
//         return null;
//       }
//     };
//     //   // Selecting the most recent reviews
//     //   console.log('Filtering by date');
//     //   await context.select('select#sortOrder', 'MOST_RECENT');
//     //   await new Promise((resolve) => setTimeout(resolve, 500));

//     //   /**
//     //    * Function checking whether we should load more reviews. It returns false if
//     //    * there are more than 10000 reviews loaded, or the last loaded review is
//     //    * older than 30 days.
//     //    * @param {object} todayDate today datetime object
//     //    */
//     const shouldLoadMore = async (todayDate) => {
//       const totalReviews = await context.evaluate(
//         async () => document.querySelectorAll('div.gn-card.bop-reviews__review').length,
//       );
//       if (totalReviews > 10000) return false;
//       const lastReviewDateStr = await context.evaluate(async () => {
//         const allReviews = document.querySelectorAll('div.gn-card.bop-reviews__review');
//         const lastReview = allReviews[allReviews.length - 1];
//         const dateElem = lastReview.querySelector('meta[itemprop="datePublished"]');
//         return dateElem ? dateElem.getAttribute('content') : '';
//       });

//       const lastReviewDate = getDate(lastReviewDateStr);
//       if (!lastReviewDate) return true;

//       const datesDiffInDays = getDatesDiffInDays(todayDate, lastReviewDate);
//       console.log(`The difference between dates: ${datesDiffInDays} days`);
//       return !(datesDiffInDays > 30);
//     };

//     const today = new Date();
//     while (await shouldLoadMore(today)) {
//       console.log('Loading more reviews');
//       try {
//         console.log('Trying to load more reviews');
//         await context.click('div#customerReviews div.bop-reviews__navigationWrapper span.icon__chevron-right');
//         console.log('Spinner went away');
//       } catch (err) {
//         console.log('No more results to load');
//         break;
//       }
//     }
//     console.log('Finished loading reviews');

//     await context.evaluate(async () => {
//       /**
//        * Function parsing a given date string to a date object
//        * @param {String} dateStr date as extracted on the page
//        */
//       const getDate = (dateStr) => {
//         try {
//           return new Date(dateStr);
//         } catch (err) {
//           return null;
//         }
//       };

//       /**
//        * Function returning a string representation of a date object in the US date format.
//        * @param {object} date review date object
//        */
//       const formatDate = (date) => {
//         const year = date.getFullYear();
//         const month = (1 + date.getMonth()).toString().padStart(2, '0');
//         const day = date.getDate().toString().padStart(2, '0');

//         return month + '/' + day + '/' + year;
//       };
//       //     const name = document.querySelector('header.bop-title h2')
//       //       ? document.querySelector('header.bop-title h2').textContent
//       //       : '';
//       //     const aggregateRating = document.querySelector('span[itemprop="ratingValue"]')
//       //       ? document.querySelector('span[itemprop="ratingValue"]').textContent
//       //       : '';
//       //     const helpfulCount = document.evaluate(
//       //       '//span[@class="bop-reviews__recommendationNumber"]',
//       //       document,
//       //       null,
//       //       XPathResult.STRING_TYPE,
//       //       null,
//       //     ).stringValue;
//       //     // const commentCount = document.evaluate(
//       //     //   '//span[@class="bop-reviews__recommendationNumber"]',
//       //     //   document,
//       //     //   null,
//       //     //   XPathResult.STRING_TYPE,
//       //     //   null,
//       //     // ).stringValue;
//       //     document.body.setAttribute('added_name', name);
//       //     document.body.setAttribute('aggregate_rating', aggregateRating);
//       //     document.body.setAttribute('added_help', helpfulCount);
//       //     // document.body.setAttribute('added_comment', commentCount);
//       //     document.body.setAttribute('product_url', window.location.href);

//       //     const allReviews = document.querySelectorAll('div.gn-card.bop-reviews__review');
//       //     for (let i = 0; i < allReviews.length; i++) {
//       //       const review = allReviews[i];

//       //       const dateStr = review.querySelector('meta[itemprop="datePublished"]')
//       //         ? review.querySelector('meta[itemprop="datePublished"]').getAttribute('content')
//       //         : '';
//       //       const reviewDate = formatDate(getDate(dateStr));
//       //       if (reviewDate) review.setAttribute('review_date', reviewDate);
//       //       const reviewRating = document.querySelector('div.gn-card.bop-reviews__review meta[itemprop="ratingValue"]')
//       //         ? document.querySelector('div.gn-card.bop-reviews__review meta[itemprop="ratingValue"]').getAttribute('content')
//       //         : '';
//       //       if (reviewRating) review.setAttribute('review_rating', reviewRating);
//       //       const reviewText = document.querySelector('div.gn-card.bop-reviews__review>p')
//       //         ? document.querySelector('div.gn-card.bop-reviews__review>p').textContent
//       //         : '';
//       //       if (reviewText) review.setAttribute('added_text', reviewText);
//       //       const user = document.querySelector('a[itemprop="author"]')
//       //         ? document.querySelector('a[itemprop="author"]').textContent
//       //         : '';
//       //       if (user) review.setAttribute('user', user);
//       //       // if (sku) review.setAttribute('added_reviewedSku', sku);
//       //     }
//     });
//     return await context.extract(productReviews, { transform });
//   },
// };
