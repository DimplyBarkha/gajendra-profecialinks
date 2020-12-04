const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'rossmann',
    transform: transform,
    domain: 'rossmann.de',
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
      const divs = document.querySelectorAll('li meta[itemprop="datePublished"]');
      divs.forEach((meta) => {
        const date = new Date(meta.getAttribute('content'));
        if (monthDiff(date, firstDate) !== 0) {
          if (document.querySelector('li[class="bv-content-pagination-buttons-item bv-content-pagination-buttons-item-next"]')) {
            document.querySelector('li[class="bv-content-pagination-buttons-item bv-content-pagination-buttons-item-next"]').remove();
          }
        }
      });
    });
    const { transform } = parameters;
    const { productReviews } = dependencies;
    return await context.extract(productReviews, { transform });
  },
};
