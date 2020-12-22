
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'frisco',
    domain: 'frisco.pl',
    url: 'https://www.frisco.pl/q,{searchTerms}/stn,searchResults',
    loadedSelector: 'div.list-view_content',
    noResultsXPath: null,
  },
};
