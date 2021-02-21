/**
 *
 * @param { { date?: string, page: number, keywords: string } } inputs
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  const { date, page, keywords } = inputs;
  await context.evaluate(async function () {
    function checkDate () {
      const deToEn = {
        januari: 'january',
        februari: 'february',
        mars: 'march',
        april: 'april',
        maj: 'may',
        juni: 'june',
        juli: 'july',
        augusti: 'august',
        september: 'september',
        oktober: 'october',
        november: 'november',
        december: 'december',
      };
      let reviewDateRaw = document.querySelector('div[data-container="product-review-container"] div.row:nth-last-child(1) div.rating.col-xs-12:nth-last-child(1) div div.user').innerHTML.split(/,/)[1];
      const month = reviewDateRaw.split(/\s+/)[1];
      if (month) {
        const engMonth = deToEn[month.toLowerCase()];
        reviewDateRaw = reviewDateRaw.replace(month, engMonth);
      }
      const topReviewDate = new Date(reviewDateRaw);
      if (topReviewDate) {
        const month = '' + (topReviewDate.getMonth() + 1);
        const day = '' + topReviewDate.getDate();
        const year = topReviewDate.getFullYear();
        console.log(`${[year, month, day].join('-')}`);
        return `${[year, month, day].join('-')}`;
      } else {
        return false;
      }
    }
    const loadMore = document.querySelector('a[data-action="show-reviews"]');
    while (loadMore) {
      document.querySelector('a[data-action="show-reviews"]').click();
      await new Promise((resolve, reject) => setTimeout(resolve, 500));
      if (document.querySelector('a[data-action="show-reviews"]')) {
        const customDate = document.querySelector('meta[itemprop="brand"]').getAttribute('custom_date');
        // const customDate = date;
        if ((new Date(checkDate()).setHours(0, 0, 0, 0) - new Date(customDate).setHours(0, 0, 0, 0)) < 0) {
          break;
        }
      } else {
        break;
      }
    }

    const ratings = document.querySelectorAll('div[data-container="product-review-container"] div.rating');
    if (ratings) {
      Array.from(ratings).forEach(rating => {
        const stars = rating.querySelectorAll('span.fa.fa-star').length;
        let ratingVal = 0;
        if (stars) {
          ratingVal = stars;
        }
        rating.setAttribute('custom_rating', ratingVal);
      });
    }
  });

  return await context.extract(productReviews);
}
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'SV',
    store: 'snusbolaget',
    transform: null,
    domain: 'snusbolaget.se',
    zipcode: '',
  },
  implementation,
};
