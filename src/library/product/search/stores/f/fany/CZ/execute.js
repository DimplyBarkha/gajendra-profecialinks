
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CZ',
    store: 'fany',
    domain: 'fany.cz',
    url: 'https://www.fanymarket.cz/vyhledavani/?search={id}',
    loadedSelector: 'div.catalog-row',
    noResultsXPath: '//div[@class="alert alert-info"]',
    zipcode: '',
  },
};
