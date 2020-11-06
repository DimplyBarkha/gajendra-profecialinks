
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'incontinenceshop',
    domain: 'incontinenceshop.com',
    url: 'https://www.incontinenceshop.com/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
