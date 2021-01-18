
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'iciparisxl',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.product-grid',
    noResultsXPath: '//p[contains(text(),"Sorry, je zoekopdracht leverde geen resultaat op. We vonden 0 overeenkomende producten.")]',
    openSearchDefinition: null,
    domain: 'iciparisxl.nl',
    zipcode: "''",
  },
};