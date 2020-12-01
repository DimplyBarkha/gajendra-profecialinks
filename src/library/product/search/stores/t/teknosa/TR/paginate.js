module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    nextLinkSelector: 'div.pagination-bar.bottom ul.pagination li.active + li > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//strong[text()="Aradığınız kriterlere uygun sonuç bulamadık."]',
    openSearchDefinition: null,
    domain: 'teknosa.com',
    zipcode: '',
  },
};
