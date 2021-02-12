// @ts-ignore
const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'mytime',
    transform,
    domain: 'mytime.de',
    zipcode: '',
  },

  implementation: async function (inputs, parameters, context, dependencies) {
    const { transform } = parameters;
    const { productReviews } = dependencies;
    await context.evaluate(async () => {
      const consent = document.querySelector('button#accept-consent-all');
      if (consent !== null) {
        // @ts-ignore
        consent.click();
        await new Promise((resolve, reject) => setTimeout(resolve, 500));
      }
    });
    await context.evaluate(async () => {
      // const getDatesDiffInDays = (a, b) => {
      //   const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      //   // Discard the time and time-zone information.
      //   const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      //   const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

      //   return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
      // };
      // const today = new Date();
      const reviewDate = document.querySelectorAll('span.product-rating__review__date')
        ? document.querySelectorAll('span.product-rating__review__date') : [];
      reviewDate.forEach(e => {
        const date = e.innerText.split(/[./]/).reverse().join('-');
        const dateFormat = new Date(date);
        const year = dateFormat.getFullYear();
        const month = (1 + dateFormat.getMonth()).toString().padStart(2, '0');
        const day = dateFormat.getDate().toString().padStart(2, '0');
        // const fullDate = new Date(`${year}/${month}/${day}`);
        // const datesDiffInDays = getDatesDiffInDays(today, fullDate);
        // console.log(`The difference between dates: ${datesDiffInDays} days`);
        // if (!(datesDiffInDays > 100))
        e.setAttribute('date', `${year}/${month}/${day}`);
      });
      const reviewRating = document.querySelectorAll('div.product-rating__review')
        ? document.querySelectorAll('div.product-rating__review') : [];
      reviewRating.forEach(e => {
        const ratingVal = e.querySelectorAll('span[class*="star--active"]');
        e.setAttribute('review_rating', ratingVal.length);
      });
      const helpful = document.querySelectorAll('span.product-rating__review__likes');
      // @ts-ignore
      if (helpful.length !== 0) helpful.forEach(e => e.setAttribute('helpful', parseInt(e.innerText.match(/\d+/g)[0])));

      const name = document.querySelector('h1');
      if (name !== null) name.setAttribute('name', name.innerText.split('\n').join(' '));
    });

    return await context.extract(productReviews, { transform });
  },

};
