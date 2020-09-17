// @ts-nocheck
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'donaghybros',
    transform,
    domain: 'donaghybros.ie',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const categoryArr = dataLayer[3].ecommerce.detail.products[0].category.split('/');
      categoryArr.map(ele => {
        const newlink = document.createElement('a');
        newlink.setAttribute('class', 'append_category');
        newlink.setAttribute('href', ele);
        document.body.appendChild(newlink);
      });

      fetch('https://api.reviews.co.uk/merchant/latest?store=donaghy-bros&branch=').then(res => {
        return res.json();
      })
        .then(ele => {
          console.log('rating');
          const reviewCount = ele.stats.total_reviews;
          const rating = ele.stats.average_rating;
          document.body.setAttribute('review_count', reviewCount);
          document.body.setAttribute('rating', rating);
        });
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
