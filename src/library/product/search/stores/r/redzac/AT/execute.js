
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'redzac',
    domain: 'redzac.at',
    url: 'https://www.redzac.at/suche/Produkt-Uebersicht?search_term__value__i=&search_term="{searchTerms}"',
    loadedSelector: 'div.product_search_result_wrapper',
    noResultsXPath: 'div.product_search_noresult_area',
    zipcode: '',
  },
};
