
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'heb',
    domain: 'heb.com',
    url: "http://www.heb.com.mx/catalogsearch/result/?q={searchTerms}&cat=",
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
