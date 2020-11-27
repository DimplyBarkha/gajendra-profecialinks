
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'skin',
    domain: 'skin.pt',
    url: 'https://skin.pt/catalogsearch/result/?q="{searchTerms}"',
    loadedSelector: '#maincontent > div.columns > div.column.main > div.search.results',
    noResultsXPath: null,
    zipcode: '',
  },
};
