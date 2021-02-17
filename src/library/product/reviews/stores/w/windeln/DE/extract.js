
const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'windeln',
    transform,
    domain: 'windeln.de',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productReviews }) => {
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

    /**
     * Function checking whether we should load more reviews. It returns false if
     * there are more than 10000 reviews loaded, or the last loaded review is
     * older than 30 days.
     * @param {object} todayDate today datetime object
     */
    const shouldLoadMore = async (todayDate) => {
      const totalReviews = await context.evaluate(
        async () => document.querySelectorAll('li[data-content-id^="Reviews"]').length,
      );
      console.log(`totalReviews: ${totalReviews}`);
      if (totalReviews > 10000) return false;
      const lastReviewDateStr = await context.evaluate(async () => {
        const allReviews = document.querySelectorAll('li[data-content-id^="Reviews"]');
        const lastReview = allReviews[allReviews.length - 1];
        const dateElem = lastReview.querySelector('meta[itemprop="datePublished"]');
        console.log('last review date');
        console.log(dateElem.getAttribute('content'));
        return dateElem && dateElem.getAttribute('content') ? dateElem.getAttribute('content') : '';
      });

      const lastReviewDate = getDate(lastReviewDateStr);
      if (!lastReviewDate) return true;

      const datesDiffInDays = getDatesDiffInDays(todayDate, lastReviewDate);
      console.log(`The difference between dates: ${datesDiffInDays} days`);
      return !(datesDiffInDays > 30);
    };

    const showAllReviewsButton = await context.evaluate(() => !!document.querySelector('div.ratings-list-button'));
    console.log(` All reviews button exist ? ${showAllReviewsButton}`);
    if (showAllReviewsButton) {
      let modalforReviewsOpened = await context.evaluate(() => !!document.querySelector('div.ratings-bazaarvoice-overlay div#BVRRContainer div.bv-content-list-container'));
      if (!modalforReviewsOpened) {
        for (let i = 1; i < 3; i++) {
          console.log(`tried to click button: ${i} time`);
          await context.evaluate(async function () {
            const openModalReviews = document.querySelector('div.ratings-list-button');
            console.log('Press button to open modal with all reviews');
            if (openModalReviews) openModalReviews.click();
          });
          try {
            await context.waitForSelector('div.ratings-bazaarvoice-overlay div#BVRRContainer div.bv-content-list-container', { timeout: 5000 });
            modalforReviewsOpened = await context.evaluate(() => !!document.querySelector('div.ratings-bazaarvoice-overlay div#BVRRContainer div.bv-content-list-container'));
            console.log(` Modal for more reviews is open  ? ${modalforReviewsOpened}`);
            break;
          } catch (err) {
            console.log('All reviews did not load');
          }
        }
      }
    }
    const allReviewsModalLoaded = await context.evaluate(() => !!document.querySelector('div.ratings-bazaarvoice-overlay div#BVRRContainer div.bv-content-list-container'));
    console.log(` Modal for more reviews is loaded ? ${allReviewsModalLoaded}`);
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    if (allReviewsModalLoaded) {
      let numberOfLoading = 0;
      const today = new Date();
      while (await shouldLoadMore(today)) {
        console.log('Loading more reviews');
        try {
          console.log('Trying to load more reviews');
          await context.click('button.bv-content-btn-pages-load-more');
          numberOfLoading++;
          console.log(`numberOfLoading = ${numberOfLoading}`);
          await context.waitForFunction(
            () => !document.querySelector('div#bv-mbox-loading'),
            { timeout: 20000 },
          );
          console.log('Spinner went away');
        } catch (err) {
          console.log('No more results to load');
          break;
        }
      }
      console.log('Finished loading reviews');
    }
    // collects common data for all type of reviews available in DOM
    await context.evaluate(async () => {
      const ratingElem = document.querySelector('div.product-selection-ratings-stars span.ratings-stars-average');
      const rating = ratingElem ? ratingElem.textContent.replace('.', ',') : '';
      if (rating) document.body.setAttribute('rating', rating);

      const brand = document.querySelector('div.product-selection-brand a')
        ? document.querySelector('div.product-selection-brand a').textContent
        : '';
      const name = document.querySelector('h1[itemprop="name"]')
        ? document.querySelector('h1[itemprop="name"]').textContent
        : '';
      const sku = document.querySelector('h2.product-description-ean') &&
        document.querySelector('h2.product-description-ean').textContent.match(/([0-9])+/)
        ? document.querySelector('h2.product-description-ean').textContent.match(/([0-9])+/)[0]
        : null;

      document.body.setAttribute('added_brand', brand);
      document.body.setAttribute('added_name', name);
      document.body.setAttribute('added_sku', sku);
      document.body.setAttribute('product_url', window.location.href);
    });

    // collect data depending on whether there are more reviews and there is a modal with more reviews present
    await context.evaluate(async () => {
      const allReviewsModalExist = !!document.querySelector('div.ratings-bazaarvoice-overlay div#BVRRContainer');

      let allReviewsSel;
      let reviewContentSel;
      let reviewTitleSel;
      let userSel;
      let ratinValueSel;
      let synidcatedFromSel;
      let synicatedType1Sel;

      switch (allReviewsModalExist) {
        case true:
          console.log('Modal with all reviews exist');
          allReviewsSel = 'li[data-content-id^="Reviews"]';
          reviewContentSel = 'div.bv-content-summary-body-text';
          reviewTitleSel = 'h3.bv-content-title';
          userSel = 'button[itemprop="author"]';
          ratinValueSel = 'abbr.bv-rating';
          synidcatedFromSel = 'div.bv-content-data-syndication';
          synicatedType1Sel = 'div.bv-syndication-summary img.bv-brand-logo-image';
          break;
        case false:
          console.log('Modal with all reviews NOT exist, there are fewer reviews');
          allReviewsSel = 'div.ratings-list-item';
          reviewContentSel = 'div.ratings-list-item-text';
          reviewTitleSel = 'h4.ratings-list-item-title';
          userSel = 'div.ratings-list-item-name';
          ratinValueSel = 'span.ratings-stars-average';
          synidcatedFromSel = 'div.ratings-list-syndicated';
          synicatedType1Sel = 'img.ratings-list-syndicated-image';
          break;
      }

      const allReviews = document.querySelectorAll(allReviewsSel);
      for (let i = 0; i < allReviews.length; i++) {
        const review = allReviews[i];
        const reviewDateSel = review.querySelector('meta[itemprop="datePublished"]');
        const dateStr = reviewDateSel && reviewDateSel.getAttribute('content') ? reviewDateSel.getAttribute('content') : '';
        const reviewDate = dateStr;
        // This conditional is to ensure we don't extract reviews without a date
        // as the transform assumes that each review must have a date. Later we
        // only extract reviews with a 'review_date' attribute.
        if (reviewDate) review.setAttribute('review_date', reviewDate);

        const helpful = document.evaluate('.//div[@class="bv-content-feedback-btn-container"]//span[contains(text(), "Ja")]/span', review, null, XPathResult.STRING_TYPE, null).stringValue;
        if (helpful) review.setAttribute('helpful_count', helpful);

        const comments = review.querySelectorAll('ol[data-bv-v^="secondaryContentItemCollection"] li div.bv-content-core ').length;
        if (comments) review.setAttribute('comments_count', comments.toString());

        const reviewContentElem = review.querySelector(reviewContentSel);
        const reviewText = reviewContentElem && reviewContentElem.textContent ? reviewContentElem.textContent.trim() : null;
        if (reviewText) review.setAttribute('review_text', reviewText);

        const reviewTitle = review.querySelector(reviewTitleSel);
        const reviewTitleTxt = reviewTitle ? reviewTitle.textContent : null;
        if (reviewTitleTxt) review.setAttribute('review_title', reviewTitleTxt);

        const userElem = review.querySelector(userSel);
        const user = userElem ? userElem.textContent : null;
        if (user) review.setAttribute('review_user_name', user);

        const syndicatedFromElem = review.querySelector(synidcatedFromSel);
        const synicatedType1 = syndicatedFromElem ? syndicatedFromElem.querySelector(synicatedType1Sel) : null;
        const synicatedType2 = syndicatedFromElem ? syndicatedFromElem.querySelector('div.bv-product-family-summary a') : null;
        let syndicatedFrom;

        if (synicatedType1 && !synicatedType2) {
          syndicatedFrom = synicatedType1.getAttribute('alt') ? synicatedType1.getAttribute('alt') : '';
        } else if (synicatedType2 && !synicatedType1) {
          syndicatedFrom = synicatedType2.getAttribute('href') ? synicatedType2.getAttribute('href') : '';
        } else {
          syndicatedFrom = '';
        }
        if (syndicatedFrom) review.setAttribute('syndicated_from', syndicatedFrom);

        let ratingValue;
        const ratingElem = review.querySelector(ratinValueSel);
        if (ratingElem && ratingElem.getAttribute('title')) {
          ratingValue = ratingElem.getAttribute('title');
        } else if (ratingElem && !ratingElem.getAttribute('title')) {
          ratingValue = ratingElem.textContent;
        } else {
          ratingValue = '';
        }
        const rating = ratingValue ? ratingValue.replace(/\s+von(.*)/, '').replace('.', ',') : '';
        if (rating) review.setAttribute('added_rating', rating.toString());
      }
    });

    return await context.extract(productReviews, { transform });
  },
};
