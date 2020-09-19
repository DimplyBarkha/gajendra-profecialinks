
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    nextLinkSelector: 'div.p-product-listing--item p-product-listing--item__buttons',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.tiles-row',
    noResultsXPath: '//h2[contains(text(),"Leider konnten wir für Ihre Suche")]',
    openSearchDefinition: null,
    domain: 'melectronics.ch',
    zipcode: '',
  },
};
