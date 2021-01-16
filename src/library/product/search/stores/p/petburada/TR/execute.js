module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'petburada',
    domain: 'petburada.tr',
    url: 'https://www.petburada.com/Arama?1&kelime={searchTerms}',
    loadedSelector: 'div#ProductPageProductList',
    noResultsXPath: null,
    zipcode: "''",
  },
};
