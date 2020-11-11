
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'foodie',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.products-shelf > li.item',
    noResultsXPath: '//h2[contains(@class,"category-header") and contains(text(),"0 tuotetta")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'foodie.fi',
    zipcode: "''",
  },
};
