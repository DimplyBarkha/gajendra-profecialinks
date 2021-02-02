
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'viking',
    nextLinkSelector: '.page-item page-item--navigation > #paginationPageNext > span',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main#siteContent',
    noResultsXPath: '//div[@id="searchEmpty"] | //div[@id="productPage"]',
    openSearchDefinition: null,
    domain: 'viking.de',
    zipcode: '',
  },
};
