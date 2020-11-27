
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PE',
    store: 'inkafarma',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img.img-fluid',
    noResultsXPath: '//div[@id="noresultsBar"]//span//strong',
    openSearchDefinition: null,
    domain: 'inkafarma.pe',
    zipcode: '',
  },
};
