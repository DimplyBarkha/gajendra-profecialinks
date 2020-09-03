
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'ek-onlineshop',
    domain: 'ek-onlineshop.at',
    url: 'https://ek-onlineshop.at/suche?controller=search&orderby=position&orderway=desc&ssa_submit=&search_query={searchTerms}',
    loadedSelector: 'div[id="js-product-list"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
