
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'marionnaud',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.more-data-loader__content',
    noResultsXPath: '//section[contains(@data-id,"emptySearchResult")] | //div[contains(@class,"matrix ")][div/a[contains(@class,"GTM_Product_matrix")]]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'marionnaud.at',
    zipcode: '',
  },
};
