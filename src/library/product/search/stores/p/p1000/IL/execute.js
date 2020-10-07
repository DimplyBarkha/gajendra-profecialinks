
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'p1000',
    domain: 'p1000.co.il',
    url: 'https://www.p1000.co.il/site/searchresults.aspx?searchtext={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
