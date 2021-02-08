
const { transform } = require('../../../../../reviews/stores/s/shop-apotheke/DE/shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    transform,
    domain: 'shop-apotheke.com',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await context.evaluate(() => {
      function monthDiff (d1, d2) {
        let months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
      }
      const firstDate = new Date(document.body.getAttribute('firstrevdate'));
      const divs = document.querySelectorAll('div[class="rating-list-wrapper"] > div > div > ul > li:nth-child(2)');
      divs.forEach((meta) => {
        const date = new Date(meta.getAttribute('content'));
        if (monthDiff(date, firstDate) !== 0) {
          if (document.querySelector('.pagination-container>.pagination  .active+li>a')) {
            document.querySelector('.pagination-container>.pagination  .active+li>a').remove();
          }
        }
      });
    });
    const { transform } = parameters;
    const { productReviews } = dependencies;
    return await context.extract(productReviews, { transform });
  },
};
