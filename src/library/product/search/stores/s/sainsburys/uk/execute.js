
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    domain: 'sainsburys.co.uk',
    url: 'https://www.sainsburys.co.uk/gol-ui/SearchDisplayView?filters[keyword]={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
