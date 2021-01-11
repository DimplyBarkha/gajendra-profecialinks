
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'heb',
    domain: 'heb.com',
    url: "https://www.heb.com.mx/catalogsearch/result/?q={searchTerms}",
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
