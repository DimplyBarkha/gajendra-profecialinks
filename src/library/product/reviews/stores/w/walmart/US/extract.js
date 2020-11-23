const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform,
    filterReviews: null,
    domain: 'walmart.com',
    zipcode: '',
  },
  // implementation: async (
  //   { url, id, zipcode, date, days },
  //   { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
  //   context,
  //   dependencies,
  // ) => {
  //   await context.evaluate(async function () {
  //     console.log('testing');
  //   });
  // },
};
