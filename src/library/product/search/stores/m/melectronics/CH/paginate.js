
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    nextLinkSelector: 'div.p-product-listing--item__buttons > button.btn__secondary',
    mutationSelector: 'div.p-product-listing--row',
    spinnerSelector: null,
    loadedSelector: 'div.tiles-row',
    noResultsXPath: '//h2[contains(text(),"Leider konnten wir für Ihre Suche")]',
    openSearchDefinition: null,
    domain: 'melectronics.ch',
    zipcode: '',
  },
};
