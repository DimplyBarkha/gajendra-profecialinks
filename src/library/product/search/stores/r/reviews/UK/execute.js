
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'reviews',
    domain: 'reviews.co.uk',
    url: 'https://www.reviews.co.uk/search?search={searchTerms}',
    loadedSelector: 'div#SearchResults',
    noResultsXPath: '//h1[contains(text(),"We couldn")]',
    zipcode: '',
  },
};
