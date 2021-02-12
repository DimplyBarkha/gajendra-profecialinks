
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'metro',
    domain: 'metro.ca',
    url: 'https://www.metro.ca/epicerie-en-ligne/recherche?filter={searchTerms}&freeText=true',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
