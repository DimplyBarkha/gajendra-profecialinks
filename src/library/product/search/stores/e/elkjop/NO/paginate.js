
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NO',
    store: 'elkjop',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id*="searchProductsInfo"]  div[class*="col-mini-product"] > div , div[class="product-detail-page"] , div[class*="slick-track"] > div[class*="slick-active"]',
    noResultsXPath: '//*[contains(@class, "no-search-result")] | //span[contains(@class,"box-title") and  contains(., "Beklager, vi fant ingen produkttreff for søkeordet")]',
    openSearchDefinition: null,
    domain: 'elkjop.no',
    zipcode: '',
  },
};
