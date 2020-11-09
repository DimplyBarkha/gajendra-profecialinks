
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CO',
    store: 'farmatodo',
    domain: 'farmatodo.com.co',
    url: 'https://www.farmatodo.com.co/buscar?producto={searchTerms}',
    loadedSelector: '//div[contains(@class,"cont-card-ftd")]',
    noResultsXPath: null,
    zipcode: '',
  },
};
