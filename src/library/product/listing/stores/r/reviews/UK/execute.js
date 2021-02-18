
module.exports = {
  implements: 'product/listing/execute',
  parameterValues: {
    country: 'UK',
    store: 'reviews',
    domain: 'reviews.co.uk',
    loadedSelector: 'div.StorePage',
    noResultsXPath: null,
    gotoUrlTemplate: null,
    // gotoUrlTemplate: 'https://www.reviews.io/company-reviews/store/{queryParams}',
    zipcode: '',
  },
};
