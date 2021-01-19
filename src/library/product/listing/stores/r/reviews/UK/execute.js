
module.exports = {
  implements: 'product/listing/execute',
  parameterValues: {
    country: 'UK',
    store: 'reviews',
    domain: 'reviews.co.uk',
    loadedSelector: 'div.StorePage',
    noResultsXPath: null,
    zipcode: '',
  },
};
