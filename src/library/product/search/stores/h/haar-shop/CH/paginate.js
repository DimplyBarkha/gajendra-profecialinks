
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'haar-shop',
    nextLinkSelector: 'div.item pages-item-next cs-pagination__next',
    mutationSelector: "//div[contains(@class,'toolbar toolbar-products cs-toolbar cs-page-category__toolbar')]//div[contains(@class,'field cs-pagination__page-provider')]",
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//h3[contains(text(),'Keine Ergebnisse für Suchanfrage')]",
    openSearchDefinition: null,
    domain: 'haar-shop.ch',
    zipcode: '',
  },
};
