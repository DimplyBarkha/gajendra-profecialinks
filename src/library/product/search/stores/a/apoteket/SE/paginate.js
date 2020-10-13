
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'apoteket',
    nextLinkSelector: 'div.search__footer button[type="button"]',
    mutationSelector: 'div.search__footer button[type="button"]',
    spinnerSelector: null,
    loadedSelector: 'div.product-grid__items div.grid-item',
    noResultsXPath: '//div[@class="product-grid__loader" and contains(text(), "Inga produkter hittades")]',
    openSearchDefinition: null,
    domain: 'apoteket.se',
    zipcode: '',
  },
};
