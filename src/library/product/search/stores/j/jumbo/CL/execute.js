
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CL',
    store: 'jumbo',
    domain: 'jumbo.cl',
    url: 'https://www.jumbo.cl/busqueda?ft={searchTerms}',
    loadedSelector: 'ul.shelf-list',
    noResultsXPath: '//div[contains(@class, "error-404-empty-message")]',
    zipcode: '',
  },
};
