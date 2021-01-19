
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'tiendanimal',
    nextLinkSelector: '//li/a[contains(text(),\'Sig\')]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productList',
    noResultsXPath: '//h2[@class="fs-20 color-secundary border-bottom pb2 mb2"]',
    openSearchDefinition: null,
    domain: 'tiendanimal.es',
    zipcode: '',
  },
};
