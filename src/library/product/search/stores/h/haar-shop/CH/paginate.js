
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'haar-shop',
    nextLinkSelector: 'div.cs-pagination__next a.cs-pagination__action--next-page',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol.products li',
    noResultsXPath: '//h3[contains(text(),"Keine Ergebnisse für Suchanfrage")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'haar-shop.ch',
    zipcode: "''",
  },
};
