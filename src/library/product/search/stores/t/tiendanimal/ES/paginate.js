
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'tiendanimal',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="left"] img.teaser__stamp.absolute.sello.lazyloaded',
    noResultsXPath: '//h2[@class="fs-20 color-secundary border-bottom pb2 mb2"]',
    openSearchDefinition: null,
    domain: 'tiendanimal.es',
    zipcode: '',
  },
};
