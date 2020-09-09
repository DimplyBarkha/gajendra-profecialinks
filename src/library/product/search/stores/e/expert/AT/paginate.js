
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    nextLinkSelector: 'div.row--paging-wrapper-bottom a.paging-arrow-next',
    mutationSelector: null,
    spinnerSelector: 'main[style="opacity: 0.4;"]',
    loadedSelector: 'div.product-paging, div.product-item a',
    noResultsXPath: '//*[contains(text(),"Leider aktuell kein Treffer zu Ihrem Suchbegriff")]',
    openSearchDefinition: null,
    domain: 'expert.at',
    zipcode: '',
  },
};
