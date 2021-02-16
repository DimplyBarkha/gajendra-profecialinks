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
    await context.evaluate(async () => {
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
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

      const brand = document.evaluate('//div[@class="formLabel SB_m EffortItemCode"]//div[@class="formLabel SL_m"]/text()', document, null, XPathResult.STRING_TYPE, null).stringValue;

      const name = document.evaluate('//h1[@class="skuName"]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const sku = document.evaluate('//div[@class="formLabel SB_m EffortItemCode"]//div[@class="formLabel"][contains(@content, "mpn")]/text()', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const ratingElem = document.evaluate('//div[contains(@class, "skuReviews")]//span[@id="productRating"]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const rating = ratingElem ? ratingElem.replace('.', ',') : '';
      if (rating) document.body.setAttribute('rating', rating);

      document.body.setAttribute('added_brand', brand);
      document.body.setAttribute('added_name', name);
      document.body.setAttribute('added_sku', sku);
      document.body.setAttribute('product_url', window.location.href);

      const allReviews = document.querySelectorAll('div.pr-review');
      for (let i = 0; i < allReviews.length; i++) {
        const review = allReviews[i];

        const dateStr = document.evaluate('//p[@class="pr-rd-details pr-rd-author-submission-date"]/time/@datetime', review, null, XPathResult.STRING_TYPE, null).stringValue;
        const reviewDate = formatDate(getDate(dateStr));

        // This conditional is to ensure we don't extract reviews without a date
        // as the transform assumes that each review must have a date. Later we
        // only extract reviews with a 'review_date' attribute.
        if (reviewDate) review.setAttribute('review_date', reviewDate);

        const ratingValue = document.evaluate('//div[contains(@class, "skuReviews")]//span[@id="productRating"]', review, null, XPathResult.STRING_TYPE, null).stringValue;
        if (ratingValue) review.setAttribute('added_rating', ratingValue.toString());
      }
    });

    return await context.extract(productReviews, { transform });
  },
};
