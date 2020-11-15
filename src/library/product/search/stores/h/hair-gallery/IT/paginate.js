
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'hair-gallery',
    nextLinkSelector: 'div.pagination a:nth-last-child(2)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-grid div.product-block',
    noResultsXPath: '//div[@class="content" and contains(.,"Non ci sono prodotti che soddisfino i criteri di ricerca.")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'hair-gallery.it',
    zipcode: "''",
  },
};
