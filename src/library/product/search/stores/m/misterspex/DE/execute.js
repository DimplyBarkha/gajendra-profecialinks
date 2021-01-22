
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'misterspex',
    domain: 'misterspex.de',
    url: 'https://www.misterspex.de/INTERSHOP/web/WFS/MisterSpex-MisterSpexDE-Site/de_DE/-/EUR/ViewParametricSearch-Browse?SearchTerm={searchTerms}',
    loadedSelector: '.spex-productList__products',
    noResultsXPath: null,
    zipcode: '',
  },
};
