
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'ES',
    store: 'tiendanimal',
    nextLinkXpath: '//li/a[contains(text(),\'Sig\')]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productList',
    noResultsXPath: '//h2[@class="fs-20 color-secundary border-bottom pb2 mb2"]',
    openSearchDefinition: null,
    domain: 'tiendanimal.es',
    zipcode: '',
  },
};
