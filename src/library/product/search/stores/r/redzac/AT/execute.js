
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'redzac',
    domain: 'redzac.at',
    url: 'https://www.redzac.at/info/portal/vs=rzat/Frontend/search/main.ipm?search=article&search__search_term="{searchTerms}"',
    loadedSelector: 'div.product_search_result_wrapper',
    noResultsXPath: 'div.product_search_noresult_area',
    zipcode: '',
  },
};
