
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'mumzworld',
    domain: 'mumzworld.com',
    url: 'https://www.mumzworld.com/en/#search={searchTerms}&page=0&minReviewsCount=0&minPrice=0&curmaxPrice=99999&refinements=%5B%5D',
    loadedSelector: 'div#hits ul[class *="products-grid"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
