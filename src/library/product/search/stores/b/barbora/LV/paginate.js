
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'LV',
    store: 'barbora',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class="b-warning"]',
    openSearchDefinition: null,
    domain: 'barbora.lv',
    zipcode: '',
  },
};
