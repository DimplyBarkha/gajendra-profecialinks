
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'iciparisxl',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.product-grid',
    noResultsXPath: '//p[contains(text(),"Nous avons trouvé 0 produits.")]',
    openSearchDefinition: null,
    domain: 'iciparisxl.be',
    zipcode: "''",
  },
};
