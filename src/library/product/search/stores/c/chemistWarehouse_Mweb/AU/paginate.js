
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse_Mweb',
    // nextLinkSelector: 'a#nextLinkSelector',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.search__result__product__list',
    noResultsXPath: 'div.search-results-category-list--empty',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
};
