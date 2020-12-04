
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'doz',
    domain: 'doz.pl',
    url: 'https://www.doz.pl/apteka/szukaj?search={searchTerms}',
    loadedSelector: 'div#product-list',
    noResultsXPath: '//span[contains(.,"0 produktów")]',
    zipcode: '',
  },
};
