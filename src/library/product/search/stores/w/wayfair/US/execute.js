
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    domain: 'wayfair.US',
    url: 'https://www.wayfair.com/keyword.php?prefetch=false&class_id=&keyword={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
