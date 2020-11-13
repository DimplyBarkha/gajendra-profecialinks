
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'carrefour',
    nextLinkSelector: 'li.pagination-next a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.product__listing div.product-item',
    noResultsXPath: '//div[@class="slp-container" and contains(.,"Er zijn geen resultaten gevonden voor je zoekopdracht. Voer een nieuwe zoekopdracht in")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'carrefour.eu',
    zipcode: "''",
  },
};
